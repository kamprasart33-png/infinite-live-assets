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
      const { isNull } = await import("drizzle-orm");
      const removed = await db
        .delete(tracks)
        .where(isNull(tracks.youtubeId))
        .returning({ id: tracks.id });
      logger.info({ count: removed.length }, "Removed legacy demo tracks");
    }

    const inserted = await db.insert(tracks).values(TRACK_CATALOG).returning();
    logger.info({ count: inserted.length }, "Seeded real track catalog");
  } catch (err) {
    logger.error({ err }, "Track catalog seed check failed");
  }
}
