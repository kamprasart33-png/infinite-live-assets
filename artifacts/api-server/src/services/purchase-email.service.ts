import { db } from "@workspace/db";
import { orders } from "@workspace/db/schema";
import { eq, sql } from "drizzle-orm";

export async function sendPurchaseEmail(orderId: number): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.EMAIL_FROM?.trim();
  if (!apiKey || !from) {
    throw new Error("Purchase email settings are missing");
  }

  await db.transaction(async (tx) => {
    // Serialize concurrent webhook and success-page requests.
    await tx.execute(sql`
      SELECT id FROM public.orders
      WHERE id = ${orderId} FOR UPDATE
    `);

    const [order] = await tx
      .select()
      .from(orders)
      .where(eq(orders.id, orderId));

    if (!order) throw new Error("Purchase email order not found");
    if (order.emailSentAt) return;
    if (order.status !== "completed" || !order.customerEmail) {
      throw new Error("Purchase email requires a completed order and email");
    }

    const downloadUrl = new URL(
      "/success",
      "https://infiniteaudioarchive.com"
    );
    downloadUrl.searchParams.set("session_id", order.stripeSessionId);

    const text = [
      `Hello ${order.customerName},`,
      "",
      "Thank you for purchasing from Infinite Audio Archive.",
      `Track: ${order.trackTitle ?? "Purchased track"}`,
      `License: ${order.licenseType}`,
      `Amount paid: $${(order.amountCents / 100).toFixed(2)} USD`,
      `Invoice: ${order.invoiceNumber ?? order.id}`,
      "",
      "Open your purchase page to download your audio and license certificate:",
      downloadUrl.toString(),
      "",
      "Keep this email to return to your downloads.",
      "Keep your purchase link private.",
      "",
      "Infinite Audio Archive",
    ].join("\n");

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `purchase-email-v1-${order.id}`,
      },
      body: JSON.stringify({
        from,
        to: [order.customerEmail],
        subject: "Your Infinite Audio Archive downloads",
        text,
      }),
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      throw new Error(`Purchase email rejected: HTTP ${response.status}`);
    }
    const result = await response.json() as { id?: string };
    if (!result.id) throw new Error("Purchase email acceptance not confirmed");

    await tx
      .update(orders)
      .set({ emailSentAt: new Date() })
      .where(eq(orders.id, order.id));
  });
}
