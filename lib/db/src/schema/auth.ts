import { sql } from 'drizzle-orm';
import { index, jsonb, pgEnum, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

// This table backs both browser (cookie) and mobile (bearer token) sessions.
export const sessionsTable = pgTable(
  'sessions',
  {
    sid: varchar('sid').primaryKey(),
    sess: jsonb('sess').notNull(),
    expire: timestamp('expire').notNull(),
  },
  (table) => [index('IDX_session_expire').on(table.expire)],
);

export const userRoleEnum = pgEnum('user_role', ['admin', 'staff']);

// Internal admin/staff accounts. Authenticated via email + password
// (see artifacts/api-server/src/lib/auth.ts) — not related to customers,
// who purchase licenses without an account.
export const usersTable = pgTable('users', {
  id: varchar('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  email: varchar('email').unique(),
  passwordHash: varchar('password_hash'),
  role: userRoleEnum('role').notNull().default('staff'),
  firstName: varchar('first_name'),
  lastName: varchar('last_name'),
  profileImageUrl: varchar('profile_image_url'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type UpsertUser = typeof usersTable.$inferInsert;
export type User = typeof usersTable.$inferSelect;
