import {
  pgTable,
  serial,
  varchar,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { orders } from "./orders";
import { customers } from "./customers";

export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  invoiceNumber: varchar("invoice_number", { length: 50 }).notNull().unique(),
  orderId: integer("order_id")
    .notNull()
    .unique()
    .references(() => orders.id),
  customerId: integer("customer_id")
    .notNull()
    .references(() => customers.id),
  description: varchar("description", { length: 500 }).notNull(),
  amountCents: integer("amount_cents").notNull(),
  currency: varchar("currency", { length: 10 }).notNull().default("usd"),
  status: varchar("status", { length: 50 }).notNull().default("paid"), // paid | refunded | void
  issuedAt: timestamp("issued_at").defaultNow().notNull(),
});

export const insertInvoiceSchema = createInsertSchema(invoices).omit({
  id: true,
  issuedAt: true,
});
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type Invoice = typeof invoices.$inferSelect;
