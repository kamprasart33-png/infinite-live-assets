import { pgTable, serial, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  trackId: integer("track_id"),
  customerId: integer("customer_id"),
  // Denormalized for fast display without joins
  trackTitle: varchar("track_title", { length: 255 }),
  customerName: varchar("customer_name", { length: 255 }),
  customerEmail: varchar("customer_email", { length: 255 }),
  licenseType: varchar("license_type", { length: 100 }).notNull(),
  amountCents: integer("amount_cents").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({ id: true, createdAt: true });
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
