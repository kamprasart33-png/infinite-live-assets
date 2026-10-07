import { db } from "@workspace/db";
import { tracks, transactions } from "@workspace/db/schema";
import { sql, desc, eq, isNull } from "drizzle-orm";

export async function getAllTracks() {
  const rows = await db.select().from(tracks).where(isNull(tracks.deletedAt)).orderBy(desc(tracks.createdAt));
  return rows.map(({ fileUrl, ...track }) => ({ ...track, audioReady: Boolean(fileUrl) }));
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
    LEFT JOIN transactions tx ON tx.track_id = t.id
      AND tx.status = 'active'
      AND EXISTS (
        SELECT 1 FROM orders o
        WHERE o.id = tx.order_id
          AND o.livemode = true AND o.status = 'completed'
      )
    GROUP BY t.id
    ORDER BY revenue_cents DESC
    LIMIT ${limit}
  `);
  return rows.rows;
}
