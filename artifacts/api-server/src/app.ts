import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import { WebhookHandlers } from "./webhookHandlers";
import { authMiddleware } from "./middlewares/authMiddleware";
import router from "./routes";
import { logger } from "./lib/logger";
import { getUncachableStripeClient } from "./stripeClient";
import { fulfillOrder } from "./services/checkout.service";

const app: Express = express();

// Separate signed endpoint for order fulfillment. Stripe retries non-2xx
// responses, while fulfillOrder is idempotent for repeated event delivery.
app.post(
  "/api/checkout/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const secret = process.env.STRIPE_CHECKOUT_WEBHOOK_SECRET;
    const signature = req.headers["stripe-signature"];
    if (!secret || typeof signature !== "string" || !Buffer.isBuffer(req.body)) {
      res.status(400).json({ error: "Webhook configuration or signature missing" });
      return;
    }
    try {
      const stripe = await getUncachableStripeClient();
      const event = stripe.webhooks.constructEvent(req.body, signature, secret);
      if (event.type === "checkout.session.completed" ||
          event.type === "checkout.session.async_payment_succeeded") {
        const session = event.data.object;
        if (session.payment_status === "paid" && session.metadata?.track_id) {
          await fulfillOrder(session.id);
        }
      }
      res.status(200).json({ received: true });
    } catch (err) {
      logger.error({ err }, "Checkout fulfillment webhook error");
      res.status(400).json({ error: "Webhook processing failed" });
    }
  },
);

// ── Stripe webhook MUST come before express.json() ────────────────────────
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const signature = req.headers["stripe-signature"];
    if (!signature) {
      res.status(400).json({ error: "Missing stripe-signature" });
      return;
    }
    const sig = Array.isArray(signature) ? signature[0] : signature;
    try {
      await WebhookHandlers.processWebhook(req.body as Buffer, sig);
      res.status(200).json({ received: true });
    } catch (err: any) {
      logger.error({ err }, "Stripe webhook error");
      res.status(400).json({ error: "Webhook error" });
    }
  },
);

// ── General middleware ─────────────────────────────────────────────────────
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return { id: req.id, method: req.method, url: req.url?.split("?")[0] };
      },
      res(res) {
        return { statusCode: res.statusCode };
      },
    },
  }),
);
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authMiddleware);

app.use("/api", router);

export default app;
