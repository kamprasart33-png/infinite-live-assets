/**
 * Replaces the demo catalog with the real YouTube channel catalog.
 * Idempotent: upserts by youtubeId; removes demo tracks (rows with no youtubeId).
 * Run: node_modules/.bin/tsx artifacts/api-server/src/scripts/import-youtube-tracks.ts
 */
import { db } from "@workspace/db";
import { tracks, orders, licenses, transactions } from "@workspace/db/schema";
import { isNull, and, eq, inArray } from "drizzle-orm";
import { TRACK_CATALOG } from "../trackCatalog";

async function run() {
  // Remove demo tracks — but only rows with no uploaded audio file and no
  // references from historical orders/licenses/transactions.
  const referenced = new Set<number>();
  for (const table of [orders, licenses, transactions]) {
    const rows = await db.select({ trackId: table.trackId }).from(table);
    for (const r of rows) if (r.trackId != null) referenced.add(r.trackId);
  }
  const demoRows = await db
    .select({ id: tracks.id })
    .from(tracks)
    .where(and(isNull(tracks.youtubeId), isNull(tracks.fileUrl)));
  const deletable = demoRows.map((t) => t.id).filter((id) => !referenced.has(id));
  const removed = deletable.length
    ? await db.delete(tracks).where(inArray(tracks.id, deletable)).returning({ id: tracks.id })
    : [];
  console.log(`Removed ${removed.length} demo track(s); kept ${demoRows.length - removed.length} referenced/file-backed`);

  let created = 0,
    updated = 0;
  for (const t of TRACK_CATALOG) {
    const existing = await db
      .select({ id: tracks.id })
      .from(tracks)
      .where(eq(tracks.youtubeId, t.youtubeId));
    if (existing.length > 0) {
      await db.update(tracks).set(t).where(eq(tracks.id, existing[0].id));
      updated++;
    } else {
      await db.insert(tracks).values(t);
      created++;
    }
  }
  console.log(`✅ Imported catalog: ${created} created, ${updated} updated`);
  process.exit(0);
}

run().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
