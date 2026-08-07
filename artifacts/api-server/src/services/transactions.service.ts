import { db } from "@workspace/db";
import { transactions } from "@workspace/db/schema";
import { sql, desc, eq } from "drizzle-orm";

export async function getRecentTransactions(limit = 10) {
  return db
    .select()
    .from(transactions)
    .orderBy(desc(transactions.createdAt))
    .limit(limit);
}

export async function getActiveLicenses(limit = 50) {
  return db
    .select()
    .from(transactions)
    .where(eq(transactions.status, "active"))
    .orderBy(desc(transactions.createdAt))
    .limit(limit);
}

export async function getLicensesByType() {
  const rows = await db.execute<{ license_type: string; count: number; revenue_cents: number }>(sql`
    SELECT
      license_type,
      COUNT(*)::int AS count,
      COALESCE(SUM(amount_cents), 0)::int AS revenue_cents
    FROM transactions
    WHERE status = 'active'
    GROUP BY license_type
    ORDER BY revenue_cents DESC
  `);
  return rows.rows;
}
