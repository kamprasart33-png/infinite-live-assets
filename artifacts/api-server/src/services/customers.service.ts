import { db } from "@workspace/db";
import { customers, transactions } from "@workspace/db/schema";
import { sql, desc, eq } from "drizzle-orm";

export async function getNewestCustomers(limit = 10) {
  return db
    .select()
    .from(customers)
    .orderBy(desc(customers.createdAt))
    .limit(limit);
}

export async function getActiveCustomers(limit = 20) {
  return db
    .select()
    .from(customers)
    .where(eq(customers.status, "active"))
    .orderBy(desc(customers.totalSpentCents))
    .limit(limit);
}

export async function getAllCustomers(limit = 50) {
  return db
    .select()
    .from(customers)
    .orderBy(desc(customers.totalSpentCents))
    .limit(limit);
}
