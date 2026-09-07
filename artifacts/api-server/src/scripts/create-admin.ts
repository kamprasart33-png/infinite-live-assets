/**
 * One-off script to create the first admin account, once, after deploying.
 * There is no admin yet at that point, so this bypasses the normal
 * (admin-only) /api/auth/register route and writes directly to the database.
 *
 * Usage (from workspace root, with DATABASE_URL set):
 *   node_modules/.bin/tsx artifacts/api-server/src/scripts/create-admin.ts \
 *     --email you@example.com --password "a-strong-password" [--first-name Jane] [--last-name Doe]
 *
 * Safe to re-run: if an account with that email already exists, it is
 * promoted to admin and its password is updated rather than duplicated.
 */
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

function getArg(name: string): string | undefined {
  const flag = `--${name}`;
  const idx = process.argv.indexOf(flag);
  return idx !== -1 ? process.argv[idx + 1] : undefined;
}

const email = getArg("email")?.toLowerCase();
const password = getArg("password");
const firstName = getArg("first-name") ?? null;
const lastName = getArg("last-name") ?? null;

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}
if (!email || !password) {
  console.error(
    "Usage: create-admin.ts --email you@example.com --password \"a-strong-password\" [--first-name Jane] [--last-name Doe]",
  );
  process.exit(1);
}
if (password.length < 8) {
  console.error("Password must be at least 8 characters.");
  process.exit(1);
}

const passwordHash = await bcrypt.hash(password, 12);

const [existing] = await db
  .select({ id: usersTable.id })
  .from(usersTable)
  .where(eq(usersTable.email, email));

if (existing) {
  await db
    .update(usersTable)
    .set({ passwordHash, role: "admin", firstName, lastName })
    .where(eq(usersTable.id, existing.id));
  console.log(`✅ Existing account ${email} updated and promoted to admin.`);
} else {
  await db.insert(usersTable).values({
    email,
    passwordHash,
    role: "admin",
    firstName,
    lastName,
  });
  console.log(`✅ Admin account created for ${email}.`);
}

process.exit(0);
