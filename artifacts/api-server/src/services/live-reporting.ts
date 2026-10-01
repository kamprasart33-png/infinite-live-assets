import { customers, licenses, transactions } from "@workspace/db/schema";
import { and, eq, sql } from "drizzle-orm";

export const liveTransactionFilter = and(
  eq(transactions.status, "active"),
  sql`EXISTS (
    SELECT 1 FROM orders o
    WHERE o.id = ${transactions.orderId}
      AND o.livemode = true AND o.status = 'completed'
  )`,
);

export const liveLicenseFilter = and(
  eq(licenses.status, "active"),
  sql`EXISTS (
    SELECT 1 FROM orders o
    WHERE o.id = ${licenses.orderId}
      AND o.livemode = true AND o.status = 'completed'
  )`,
);

export const liveCustomerFilter = sql`EXISTS (
  SELECT 1 FROM transactions tx
  JOIN orders o ON o.id = tx.order_id
  WHERE tx.customer_id = customers.id
    AND tx.status = 'active'
    AND o.livemode = true AND o.status = 'completed'
)`;

export const liveCustomerSpend = sql<number>`(
  SELECT COALESCE(SUM(tx.amount_cents), 0)::int
  FROM transactions tx
  JOIN orders o ON o.id = tx.order_id
  WHERE tx.customer_id = customers.id
    AND tx.status = 'active'
    AND o.livemode = true AND o.status = 'completed'
)`;
