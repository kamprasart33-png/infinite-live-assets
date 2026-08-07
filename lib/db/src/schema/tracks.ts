import { pgTable, serial, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const tracks = pgTable("tracks", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  artist: varchar("artist", { length: 255 }).notNull().default("Khmer Smoke"),
  genre: varchar("genre", { length: 100 }),
  duration: varchar("duration", { length: 20 }),
  priceCents: integer("price_cents").notNull().default(4900),
  plays: integer("plays").notNull().default(0),
  fileUrl: varchar("file_url", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTrackSchema = createInsertSchema(tracks).omit({ id: true, createdAt: true });
export type InsertTrack = z.infer<typeof insertTrackSchema>;
export type Track = typeof tracks.$inferSelect;
