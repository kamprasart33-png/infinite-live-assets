import {
  pgTable,
  serial,
  varchar,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  stripeSessionId: varchar("stripe_session_id", { length: 255 })
    .notNull()
    .unique(),
  stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),
  trackId: integer("track_id"),
  trackTitle: varchar("track_title", { length: 255 }),
  licenseType: varchar("license_type", { length: 100 }).notNull(),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  customerEmail: varchar("customer_email", { length: 255 }).notNull(),
  amountCents: integer("amount_cents").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  invoiceNumber: varchar("invoice_number", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;
