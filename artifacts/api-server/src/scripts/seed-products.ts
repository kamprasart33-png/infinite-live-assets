/**
 * Creates Khmer Smoke license products in Stripe (idempotent).
 * Run: pnpm --filter @workspace/api-server exec tsx src/scripts/seed-products.ts
 */
import { getUncachableStripeClient } from "../stripeClient";

const LICENSE_TYPES = [
  {
    name: "YouTube License",
    description: "Use in YouTube videos — includes monetisation rights",
    licenseType: "YouTube",
    amount: 4900,
  },
  {
    name: "Podcast License",
    description: "Use in podcast episodes and audio shows",
    licenseType: "Podcast",
    amount: 3900,
  },
  {
    name: "Commercial License",
    description: "Use in advertisements and commercial productions",
    licenseType: "Commercial",
    amount: 9900,
  },
  {
    name: "Film License",
    description: "Use in short films, documentaries and video productions",
    licenseType: "Film",
    amount: 14900,
  },
  {
    name: "Enterprise License",
    description: "Unlimited use across all platforms and productions",
    licenseType: "Enterprise",
    amount: 29900,
  },
];

async function run() {
  const stripe = await getUncachableStripeClient();
  console.log("Creating Khmer Smoke license products in Stripe…\n");

  for (const lic of LICENSE_TYPES) {
    // Check if product already exists
    const existing = await stripe.products.search({
      query: `name:'${lic.name}' AND active:'true'`,
    });

    if (existing.data.length > 0) {
      const prod = existing.data[0];
      console.log(`✓ ${lic.name} already exists (${prod.id})`);
      continue;
    }

    const product = await stripe.products.create({
      name: lic.name,
      description: lic.description,
      metadata: { license_type: lic.licenseType },
    });

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: lic.amount,
      currency: "usd",
    });

    console.log(
      `✓ Created ${lic.name}: $${(lic.amount / 100).toFixed(2)} → price ${price.id}`,
    );
  }

  console.log("\n✅ Stripe products ready.");
}

run().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
