/**
 * Idempotent migration script that creates the auth tables required by Replit Auth.
 * Safe to run multiple times — uses CREATE TABLE IF NOT EXISTS.
 *
 * Usage (from workspace root):
 *   node_modules/.bin/tsx artifacts/api-server/src/scripts/run-auth-migrations.ts
 */
import { sql } from "drizzle-orm";
import { db } from "@workspace/db";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

console.log("Running auth migrations…");

await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "sessions" (
    "sid"    varchar PRIMARY KEY,
    "sess"   jsonb    NOT NULL,
    "expire" timestamp NOT NULL
  )
`);

await db.execute(sql`
  CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "sessions" ("expire")
`);

await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "users" (
    "id"                varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    "email"             varchar UNIQUE,
    "first_name"        varchar,
    "last_name"         varchar,
    "profile_image_url" varchar,
    "created_at"        timestamptz NOT NULL DEFAULT now(),
    "updated_at"        timestamptz NOT NULL DEFAULT now()
  )
`);

console.log("✅ Auth schema migrations complete.");
process.exit(0);
