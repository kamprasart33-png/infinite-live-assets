import { getUncachableStripeClient } from "../stripeClient";
import { db } from "@workspace/db";
import { sql } from "drizzle-orm";

const stripe = await getUncachableStripeClient();

// Check products in Stripe API
const products = await stripe.products.list({ limit: 10, active: true });
console.log(`Stripe API products (${products.data.length}):`);
for (const p of products.data) console.log(` - ${p.id}: ${p.name}`);

// Check prices in Stripe API
const prices = await stripe.prices.list({ limit: 20, active: true });
console.log(`\nStripe API prices (${prices.data.length}):`);
for (const pr of prices.data) console.log(` - ${pr.id}: $${(pr.unit_amount ?? 0) / 100} → ${pr.product}`);

// Check DB stripe schema
const dbProducts = await db.execute(sql`SELECT COUNT(*) as count FROM stripe.products`);
console.log(`\nDB stripe.products count: ${dbProducts.rows[0]?.count}`);
