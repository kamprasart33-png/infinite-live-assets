import { db } from "@workspace/db";
import { customers } from "@workspace/db/schema";
import { and, desc, eq, getTableColumns } from "drizzle-orm";
import { liveCustomerFilter, liveCustomerSpend } from "./live-reporting";

const columns = {
  ...getTableColumns(customers),
  totalSpentCents: liveCustomerSpend,
};

export async function getNewestCustomers(limit = 10) {
  return db.select(columns).from(customers)
    .where(liveCustomerFilter)
    .orderBy(desc(customers.createdAt)).limit(limit);
}

export async function getActiveCustomers(limit = 20) {
  return db.select(columns).from(customers)
    .where(and(eq(customers.status, "active"), liveCustomerFilter))
    .orderBy(desc(liveCustomerSpend)).limit(limit);
}

export async function getAllCustomers(limit = 50) {
  return db.select(columns).from(customers)
    .where(liveCustomerFilter)
    .orderBy(desc(liveCustomerSpend)).limit(limit);
}
