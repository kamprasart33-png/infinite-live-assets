import { getStripeSync } from "./stripeClient";
import app from "./app";
import { logger } from "./lib/logger";

async function initStripe() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    logger.warn("No DATABASE_URL — skipping Stripe init");
    return;
  }
  try {
    // NOTE: runMigrations() cannot be called from the bundled server because
    // esbuild cannot resolve the migration SQL files at runtime. Run
    //   tsx artifacts/api-server/src/scripts/run-stripe-migrations.ts
    // from the workspace root to create the stripe schema tables.

    const stripeSync = await getStripeSync();

    const domain = process.env.REPLIT_DOMAINS?.split(",")[0];
    if (domain) {
      const webhookUrl = `https://${domain}/api/stripe/webhook`;
      await stripeSync.findOrCreateManagedWebhook(webhookUrl);
      logger.info({ webhookUrl }, "Stripe webhook configured");
    }

    // Backfill runs in background — don't block server start
    stripeSync.syncBackfill().catch((err) =>
      logger.error({ err }, "Stripe backfill error"),
    );

    logger.info("Stripe ready");
  } catch (err) {
    logger.error({ err }, "Stripe init failed — continuing without Stripe");
  }
}

const rawPort = process.env["PORT"];
if (!rawPort) throw new Error("PORT environment variable is required.");
const port = Number(rawPort);
if (Number.isNaN(port) || port <= 0)
  throw new Error(`Invalid PORT value: "${rawPort}"`);

await initStripe();

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }
  logger.info({ port }, "Server listening");
});
