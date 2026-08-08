/**
 * Replaces the demo catalog with the real YouTube channel catalog.
 * Idempotent: upserts by youtubeId; removes demo tracks (rows with no youtubeId).
 * Run: node_modules/.bin/tsx artifacts/api-server/src/scripts/import-youtube-tracks.ts
 */
import { db } from "@workspace/db";
import { tracks } from "@workspace/db/schema";
import { isNull, eq } from "drizzle-orm";
import { TRACK_CATALOG } from "../trackCatalog";

async function run() {
  // Remove demo tracks (they have no youtubeId and no fileUrl)
  const removed = await db
    .delete(tracks)
    .where(isNull(tracks.youtubeId))
    .returning({ id: tracks.id, title: tracks.title });
  console.log(`Removed ${removed.length} demo track(s)`);

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
