/**
 * One-off backfill: creates customer/license/invoice records for existing orders.
 * Run: node_modules/.bin/tsx artifacts/api-server/src/scripts/backfill-business-records.ts
 */
import { db } from "@workspace/db";
import { orders } from "@workspace/db/schema";
import { ensureBusinessRecords } from "../services/checkout.service";

async function run() {
  const allOrders = await db.select().from(orders);
  console.log(`Backfilling ${allOrders.length} order(s)…`);
  for (const order of allOrders) {
    const { customer, license, invoice } = await ensureBusinessRecords(order);
    console.log(
      `✓ order #${order.id} → customer #${customer.id}` +
        (license ? `, license ${license.licenseKey}` : ", license exists") +
        (invoice ? `, invoice ${invoice.invoiceNumber}` : ", invoice exists"),
    );
  }
  console.log("✅ Backfill complete.");
  process.exit(0);
}

run().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
