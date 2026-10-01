import { db } from "@workspace/db";
import {
  transactions,
  licenses,
} from "@workspace/db/schema";
import { sql, desc, eq, and } from "drizzle-orm";

export async function getRecentTransactions(limit = 10) {
  return db
    .select()
    .from(transactions)
    .where(and(
      eq(transactions.status, "active"),
      sql`EXISTS (
        SELECT 1 FROM orders o
        WHERE o.id = ${transactions.orderId}
          AND o.livemode = true AND o.status = 'completed'
      )`,
    ))
    .orderBy(desc(transactions.createdAt))
    .limit(limit);
}

export async function getActiveLicenses(limit = 50) {
  return db
    .select()
    .from(licenses)
    .where(and(
      eq(licenses.status, "active"),
      sql`EXISTS (
        SELECT 1 FROM orders o
        WHERE o.id = ${licenses.orderId}
          AND o.livemode = true AND o.status = 'completed'
      )`,
    ))
    .orderBy(desc(licenses.issuedAt))
    .limit(limit);
}

export async function getLicensesByType() {
  const rows = await db.execute<{
    license_type: string;
    count: number;
    revenue_cents: number;
  }>(sql`
    SELECT
      license_type,
      COUNT(*)::int AS count,
      COALESCE(SUM(amount_cents), 0)::int AS revenue_cents
    FROM transactions
    WHERE status = 'active'
      AND EXISTS (
        SELECT 1 FROM orders o
        WHERE o.id = transactions.order_id
          AND o.livemode = true AND o.status = 'completed'
      )
    GROUP BY license_type
    ORDER BY revenue_cents DESC
  `);

  return rows.rows;
}
