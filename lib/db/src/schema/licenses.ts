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

export const licenses = pgTable("licenses", {
  id: serial("id").primaryKey(),
  licenseKey: varchar("license_key", { length: 50 }).notNull().unique(),
  orderId: integer("order_id")
    .notNull()
    .unique()
    .references(() => orders.id),
  customerId: integer("customer_id")
    .notNull()
    .references(() => customers.id),
  trackId: integer("track_id"),
  trackTitle: varchar("track_title", { length: 255 }),
  licenseType: varchar("license_type", { length: 100 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("active"), // active | expired | revoked
  issuedAt: timestamp("issued_at").defaultNow().notNull(),
});

export const insertLicenseSchema = createInsertSchema(licenses).omit({
  id: true,
  issuedAt: true,
});
export type InsertLicense = z.infer<typeof insertLicenseSchema>;
export type License = typeof licenses.$inferSelect;
