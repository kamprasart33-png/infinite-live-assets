import { db } from "@workspace/db";
import { orders, transactions } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { getUncachableStripeClient } from "../stripeClient";

export interface CreateSessionParams {
  trackId: number;
  trackTitle: string;
  licenseType: string;
  priceId: string;
  customerName: string;
  customerEmail: string;
  baseUrl: string;
}

export async function createCheckoutSession(params: CreateSessionParams) {
  const {
    trackId,
    trackTitle,
    licenseType,
    priceId,
    customerName,
    customerEmail,
    baseUrl,
  } = params;

  const stripe = await getUncachableStripeClient();
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "payment",
    customer_email: customerEmail,
    success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/store/track/${trackId}`,
    metadata: {
      track_id: String(trackId),
      track_title: trackTitle,
      license_type: licenseType,
      customer_name: customerName,
    },
  });

  return session;
}

export async function fulfillOrder(sessionId: string) {
  // Idempotent — return existing order if already fulfilled
  const existing = await db
    .select()
    .from(orders)
    .where(eq(orders.stripeSessionId, sessionId));
  if (existing.length > 0) return existing[0];

  const stripe = await getUncachableStripeClient();
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["customer_details"],
  });

  if (session.payment_status !== "paid") {
    throw new Error("Payment not complete");
  }

  const meta = session.metadata ?? {};
  const invoiceNumber = `KS-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
  const amountCents = session.amount_total ?? 0;
  const customerName =
    meta.customer_name ||
    (session.customer_details as any)?.name ||
    "Unknown";
  const customerEmail =
    session.customer_email ||
    (session.customer_details as any)?.email ||
    "";

  const [order] = await db
    .insert(orders)
    .values({
      stripeSessionId: sessionId,
      stripePaymentIntentId:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : null,
      trackId: meta.track_id ? parseInt(meta.track_id) : null,
      trackTitle: meta.track_title ?? null,
      licenseType: meta.license_type ?? "Unknown",
      customerName,
      customerEmail,
      amountCents,
      status: "completed",
      invoiceNumber,
    })
    .returning();

  // Record transaction so dashboard updates automatically
  try {
    await db.insert(transactions).values({
      trackId: meta.track_id ? parseInt(meta.track_id) : null,
      customerId: null,
      trackTitle: meta.track_title ?? "Unknown Track",
      customerName,
      customerEmail,
      licenseType: meta.license_type ?? "Unknown",
      amountCents,
      status: "active",
    });
  } catch {
    // Don't fail the order if transaction insert fails
  }

  return order;
}
