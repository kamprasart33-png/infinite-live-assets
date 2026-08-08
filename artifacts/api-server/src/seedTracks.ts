import { db } from "@workspace/db";
import { tracks } from "@workspace/db/schema";
import { logger } from "./lib/logger";

const TRACK_CATALOG = [
  { title: "Neon District",      genre: "Cinematic Trap",    duration: "3:12", priceCents: 7900, plays: 2876 },
  { title: "Urban Pulse",        genre: "Cinematic Trap",    duration: "2:58", priceCents: 7900, plays:  987 },
  { title: "Midnight Protocol",  genre: "Dark Ambient",      duration: "5:01", priceCents: 9900, plays:  654 },
  { title: "Celestial Whispers", genre: "Ethereal Ambience", duration: "3:24", priceCents: 4900, plays: 1842 },
  { title: "Sakura Dreams",      genre: "Cinematic",         duration: "3:47", priceCents: 6900, plays: 1123 },
  { title: "Golden Hour",        genre: "Lo-Fi Chill",       duration: "4:12", priceCents: 4900, plays: 2340 },
  { title: "Digital Rain",       genre: "Lo-Fi Chill",       duration: "3:55", priceCents: 4900, plays: 1654 },
  { title: "Desert Wind",        genre: "World Fusion",      duration: "4:33", priceCents: 5900, plays:  432 },
  { title: "Crimson Tide",       genre: "Cinematic",         duration: "4:08", priceCents: 6900, plays:  876 },
  { title: "Aurora Protocol",    genre: "Ethereal Ambience", duration: "5:22", priceCents: 7900, plays:  543 },
  { title: "Steel Horizon",      genre: "Cinematic Trap",    duration: "3:34", priceCents: 7900, plays: 1234 },
  { title: "Monsoon Season",     genre: "World Fusion",      duration: "4:47", priceCents: 5900, plays:  321 },
];

/**
 * Seeds the track catalog if (and only if) the tracks table is empty.
 * Safe to run on every startup — a fresh production database gets the
 * catalog; an existing database is left untouched.
 */
export async function seedTracksIfEmpty(): Promise<void> {
  try {
    const existing = await db.select({ id: tracks.id }).from(tracks).limit(1);
    if (existing.length > 0) return;
    const inserted = await db.insert(tracks).values(TRACK_CATALOG).returning();
    logger.info({ count: inserted.length }, "Seeded track catalog (empty table)");
  } catch (err) {
    logger.error({ err }, "Track catalog seed check failed");
  }
}
