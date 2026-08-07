/**
 * Run stripe-replit-sync DB migrations (creates the stripe schema + tables).
 * Must be run from the workspace root via tsx so node_modules paths resolve correctly.
 *
 * Usage: node_modules/.bin/tsx artifacts/api-server/src/scripts/run-stripe-migrations.ts
 */
import { runMigrations } from "stripe-replit-sync";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

console.log("Running stripe-replit-sync migrations…");
await runMigrations({ databaseUrl, schema: "stripe" });
console.log("✅ Stripe schema migrations complete.");
