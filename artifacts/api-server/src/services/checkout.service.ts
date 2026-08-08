import { randomBytes } from "node:crypto";
import { db } from "@workspace/db";
import {
  orders,
  transactions,
  customers,
  licenses,
  invoices,
} from "@workspace/db/schema";
import { eq, sql } from "drizzle-orm";
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

/** Cryptographically random license key, e.g. LIC-8F3A2-BC91D-7E04A */
function generateLicenseKey(): string {
  const hex = randomBytes(8).toString("hex").toUpperCase();
  return `LIC-${hex.slice(0, 5)}-${hex.slice(5, 10)}-${hex.slice(10, 15)}`;
}

type Order = typeof orders.$inferSelect;

/**
 * Creates/heals the connected business records for a paid order:
 * customer (upsert by email), license, invoice, and dashboard transaction.
 *
 * Runs in a single DB transaction so a partial failure rolls back atomically.
 * Idempotent: the license row (unique per order) acts as the "already
 * processed" marker — spend accumulation and the dashboard transaction are
 * only written when the license is inserted for the first time.
 */
export async function ensureBusinessRecords(order: Order) {
  return db.transaction(async (tx) => {
    // 1. Upsert customer by email (repeat buyers reuse their record)
    const [customer] = await tx
      .insert(customers)
      .values({
        name: order.customerName,
        email: order.customerEmail,
        status: "active",
        totalSpentCents: 0,
      })
      .onConflictDoUpdate({
        target: customers.email,
        set: { name: order.customerName },
      })
      .returning();

    // 2. License — insert succeeds only the first time for this order
    const [license] = await tx
      .insert(licenses)
      .values({
        licenseKey: generateLicenseKey(),
        orderId: order.id,
        customerId: customer.id,
        trackId: order.trackId,
        trackTitle: order.trackTitle,
        licenseType: order.licenseType,
        status: "active",
      })
      .onConflictDoNothing({ target: licenses.orderId })
      .returning();

    const firstTime = Boolean(license);

    // 3. Invoice — prefer the order's invoice number; fall back to a
    //    deterministic per-order number if that value already exists
    //    (random-number collision across orders).
    const preferredNumber =
      order.invoiceNumber ?? `KS-${new Date().getFullYear()}-O${order.id}`;
    let [invoice] = await tx
      .insert(invoices)
      .values({
        invoiceNumber: preferredNumber,
        orderId: order.id,
        customerId: customer.id,
        description: `${order.licenseType} License — ${order.trackTitle ?? "Track"}`,
        amountCents: order.amountCents,
        currency: "usd",
        status: "paid",
      })
      .onConflictDoNothing()
      .returning();
    if (!invoice) {
      const existing = await tx
        .select()
        .from(invoices)
        .where(eq(invoices.orderId, order.id));
      if (existing.length > 0) {
        invoice = existing[0];
      } else {
        // invoiceNumber collision with a different order — use deterministic ID
        [invoice] = await tx
          .insert(invoices)
          .values({
            invoiceNumber: `KS-${new Date().getFullYear()}-O${order.id}`,
            orderId: order.id,
            customerId: customer.id,
            description: `${order.licenseType} License — ${order.trackTitle ?? "Track"}`,
            amountCents: order.amountCents,
            currency: "usd",
            status: "paid",
          })
          .returning();
      }
    }

    if (firstTime) {
      // 4. Count this order's amount toward the customer exactly once
      await tx
        .update(customers)
        .set({
          totalSpentCents: sql`${customers.totalSpentCents} + ${order.amountCents}`,
        })
        .where(eq(customers.id, customer.id));

      // 5. Dashboard transaction — same atomic scope, written exactly once
      await tx.insert(transactions).values({
        trackId: order.trackId,
        customerId: customer.id,
        trackTitle: order.trackTitle ?? "Unknown Track",
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        licenseType: order.licenseType,
        amountCents: order.amountCents,
        status: "active",
      });
    }

    return { customer, license, invoice, firstTime };
  });
}

export async function fulfillOrder(sessionId: string): Promise<Order> {
  // Fast path — order already exists; heal any missing connected records
  const existing = await db
    .select()
    .from(orders)
    .where(eq(orders.stripeSessionId, sessionId));
  if (existing.length > 0) {
    await ensureBusinessRecords(existing[0]); // let failures surface
    return existing[0];
  }

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

  // Race-safe insert: concurrent fulfillments of the same session — one wins,
  // the loser fetches the winner's row and proceeds identically.
  let [order] = await db
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
    .onConflictDoNothing({ target: orders.stripeSessionId })
    .returning();

  if (!order) {
    const [winner] = await db
      .select()
      .from(orders)
      .where(eq(orders.stripeSessionId, sessionId));
    if (!winner) throw new Error("Order creation failed unexpectedly");
    order = winner;
  }

  await ensureBusinessRecords(order);
  return order;
}
