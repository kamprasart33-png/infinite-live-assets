import { db } from "@workspace/db";
import { tracks, transactions } from "@workspace/db/schema";
import { sql, desc, eq } from "drizzle-orm";

export async function getAllTracks() {
  return db.select().from(tracks).orderBy(desc(tracks.createdAt));
}

export async function getTopSellingTracks(limit = 10) {
  const rows = await db.execute<{
    id: number;
    title: string;
    genre: string | null;
    price_cents: number;
    plays: number;
    revenue_cents: number;
    license_count: number;
  }>(sql`
    SELECT
      t.id,
      t.title,
      t.genre,
      t.price_cents,
      t.plays,
      COALESCE(SUM(tx.amount_cents), 0)::int AS revenue_cents,
      COUNT(tx.id)::int AS license_count
    FROM tracks t
    LEFT JOIN transactions tx ON tx.track_id = t.id AND tx.status = 'active'
    GROUP BY t.id
    ORDER BY revenue_cents DESC
    LIMIT ${limit}
  `);
  return rows.rows;
}
