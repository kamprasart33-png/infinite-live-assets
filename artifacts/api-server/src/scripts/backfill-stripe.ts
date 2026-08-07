/**
 * Force-syncs all existing Stripe data into the local stripe schema.
 * Run: node_modules/.bin/tsx artifacts/api-server/src/scripts/backfill-stripe.ts
 */
import { getStripeSync } from "../stripeClient";

console.log("Starting Stripe backfill…");
const sync = await getStripeSync();
await sync.syncBackfill();
console.log("✅ Stripe backfill complete.");
