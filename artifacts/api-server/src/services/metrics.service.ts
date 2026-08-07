import { db } from "@workspace/db";
import { transactions, tracks, customers } from "@workspace/db/schema";
import { sql, gte, and, eq } from "drizzle-orm";

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfMonth(): Date {
  const d = new Date();
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function getDashboardMetrics() {
  const today = startOfToday();
  const monthStart = startOfMonth();

  const [todayRev, monthRev, totalSales, totalTracks, activeCustomers, activeLicenses] = await Promise.all([
    // Today's revenue
    db
      .select({ total: sql<number>`coalesce(sum(amount_cents), 0)` })
      .from(transactions)
      .where(and(gte(transactions.createdAt, today), eq(transactions.status, "active")))
      .then((r) => Number(r[0]?.total ?? 0)),

    // Monthly revenue
    db
      .select({ total: sql<number>`coalesce(sum(amount_cents), 0)` })
      .from(transactions)
      .where(and(gte(transactions.createdAt, monthStart), eq(transactions.status, "active")))
      .then((r) => Number(r[0]?.total ?? 0)),

    // Total sales count (all time)
    db
      .select({ count: sql<number>`count(*)` })
      .from(transactions)
      .then((r) => Number(r[0]?.count ?? 0)),

    // Total tracks
    db
      .select({ count: sql<number>`count(*)` })
      .from(tracks)
      .then((r) => Number(r[0]?.count ?? 0)),

    // Active customers
    db
      .select({ count: sql<number>`count(*)` })
      .from(customers)
      .where(eq(customers.status, "active"))
      .then((r) => Number(r[0]?.count ?? 0)),

    // Active licenses
    db
      .select({ count: sql<number>`count(*)` })
      .from(transactions)
      .where(eq(transactions.status, "active"))
      .then((r) => Number(r[0]?.count ?? 0)),
  ]);

  // Total all-time revenue
  const totalRevResult = await db
    .select({ total: sql<number>`coalesce(sum(amount_cents), 0)` })
    .from(transactions)
    .where(eq(transactions.status, "active"));
  const totalRevenue = Number(totalRevResult[0]?.total ?? 0);

  return {
    todayRevenueCents: todayRev,
    monthlyRevenueCents: monthRev,
    totalRevenueCents: totalRevenue,
    totalSales,
    totalTracks,
    activeCustomers,
    activeLicenses,
    avgLicenseCents: totalSales > 0 ? Math.round(totalRevenue / totalSales) : 0,
  };
}

export async function getRevenueHistory() {
  // 12 months of monthly revenue
  const rows = await db.execute<{ month: string; revenue: number }>(sql`
    SELECT
      TO_CHAR(DATE_TRUNC('month', created_at), 'Mon') AS month,
      COALESCE(SUM(amount_cents), 0)::int AS revenue
    FROM transactions
    WHERE status = 'active'
      AND created_at >= NOW() - INTERVAL '12 months'
    GROUP BY DATE_TRUNC('month', created_at)
    ORDER BY DATE_TRUNC('month', created_at) ASC
  `);
  return rows.rows;
}

export async function getDailySales() {
  // 14 days of daily sales
  const rows = await db.execute<{ day: string; sales: number }>(sql`
    SELECT
      TO_CHAR(created_at::date, 'Mon DD') AS day,
      COALESCE(SUM(amount_cents), 0)::int AS sales
    FROM transactions
    WHERE status = 'active'
      AND created_at >= NOW() - INTERVAL '14 days'
    GROUP BY created_at::date
    ORDER BY created_at::date ASC
  `);
  return rows.rows;
}
