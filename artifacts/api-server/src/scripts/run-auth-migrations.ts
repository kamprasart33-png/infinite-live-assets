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
  DO $$ BEGIN
    CREATE TYPE "user_role" AS ENUM ('admin', 'staff');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
`);

await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "users" (
    "id"                varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    "email"             varchar UNIQUE,
    "password_hash"     varchar,
    "role"              "user_role" NOT NULL DEFAULT 'staff',
    "first_name"        varchar,
    "last_name"         varchar,
    "profile_image_url" varchar,
    "created_at"        timestamptz NOT NULL DEFAULT now(),
    "updated_at"        timestamptz NOT NULL DEFAULT now()
  )
`);

// Idempotent — adds the new columns if this ran previously under the old
// (Replit OIDC) schema, without touching existing rows.
await db.execute(sql`
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "password_hash" varchar
`);
await db.execute(sql`
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "role" "user_role" NOT NULL DEFAULT 'staff'
`);

console.log("✅ Auth schema migrations complete.");
process.exit(0);
