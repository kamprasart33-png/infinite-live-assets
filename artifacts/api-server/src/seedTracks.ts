import { db } from "@workspace/db";
import { tracks } from "@workspace/db/schema";
import { logger } from "./lib/logger";
import { TRACK_CATALOG } from "./trackCatalog";

/**
 * Seeds the real YouTube-channel track catalog on startup when needed:
 * - Empty table (fresh production database) → insert the catalog.
 * - Only legacy demo rows (no youtubeId anywhere) → replace them with the
 *   real catalog (one-time migration; demo rows predate the youtubeId column).
 * Any database that already contains a youtubeId-tagged track is left untouched.
 */
export async function seedTracksIfEmpty(): Promise<void> {
  try {
    const existing = await db
      .select({ id: tracks.id, youtubeId: tracks.youtubeId })
      .from(tracks);
    const hasRealCatalog = existing.some((t) => t.youtubeId !== null);
    if (hasRealCatalog) return;

    if (existing.length > 0) {
      // Only remove demo rows that are safe to delete: no uploaded audio file
      // and not referenced by any historical order, license, or transaction.
      const { isNull, and, inArray } = await import("drizzle-orm");
      const { orders, licenses, transactions } = await import("@workspace/db/schema");
      const referenced = new Set<number>();
      for (const table of [orders, licenses, transactions]) {
        const rows = await db.select({ trackId: table.trackId }).from(table);
        for (const r of rows) if (r.trackId != null) referenced.add(r.trackId);
      }
      const deletable = existing
        .map((t) => t.id)
        .filter((id) => !referenced.has(id));
      if (deletable.length > 0) {
        const removed = await db
          .delete(tracks)
          .where(and(isNull(tracks.youtubeId), isNull(tracks.fileUrl), inArray(tracks.id, deletable)))
          .returning({ id: tracks.id });
        logger.info({ count: removed.length }, "Removed unreferenced demo tracks");
      }
      const kept = existing.length - deletable.length;
      if (kept > 0) logger.info({ count: kept }, "Kept demo tracks referenced by past purchases");
    }

    const inserted = await db.insert(tracks).values(TRACK_CATALOG).returning();
    logger.info({ count: inserted.length }, "Seeded real track catalog");
  } catch (err) {
    logger.error({ err }, "Track catalog seed check failed");
  }
}
