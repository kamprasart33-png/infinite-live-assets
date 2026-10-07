import { Router, type IRouter } from "express";
import {
  createCheckoutSession,
  fulfillOrder,
} from "../services/checkout.service";
import { db } from "@workspace/db";
import { tracks } from "@workspace/db/schema";
import { eq, sql } from "drizzle-orm";
import { storage } from "../storage";

const router: IRouter = Router();

// POST /api/checkout/create-session
router.post("/checkout/create-session", async (req, res) => {
  const { trackId, priceId, customerName, customerEmail } =
    req.body;

  if (!Number.isSafeInteger(Number(trackId)) || Number(trackId) < 1 || Number(trackId) > 2147483647 ||
      typeof priceId !== "string" || !priceId ||
      typeof customerName !== "string" || !customerName.trim() ||
      typeof customerEmail !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim())) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  try {
    await db.transaction(async tx => {
    await tx.execute(sql`SELECT pg_advisory_xact_lock(8147, ${Number(trackId)})`);
    const [track] = await tx.select().from(tracks).where(eq(tracks.id, Number(trackId)));
    if (!track) { res.status(404).json({ error: "Track not found" }); return; }
    if (track.archivedAt || track.deletedAt) {
      res.status(409).json({ error: "This track is archived and unavailable for new purchases." }); return;
    }
    if (!track.fileUrl) {
      res.status(409).json({ error: "Audio download is not ready for this track. Please check back later." });
      return;
    }
    const prices = await storage.getLicensePrices();
    const selectedPrice = prices.find((price) => price.price_id === priceId);
    if (!selectedPrice || selectedPrice.currency.toLowerCase() !== "usd" ||
        !selectedPrice.unit_amount || selectedPrice.unit_amount < 1) {
      res.status(400).json({ error: "Choose an available license price" });
      return;
    }
    const licenseType = selectedPrice.product_metadata?.license_type ?? selectedPrice.product_name;
    const domain = process.env.REPLIT_DOMAINS?.split(",")[0];
    const baseUrl =
      process.env.FRONTEND_URL ||
      (domain ? `https://${domain}` : `${req.protocol}://${req.get("host")}`);

    const session = await createCheckoutSession({
      trackId: Number(trackId),
      trackTitle: track.title,
      licenseType,
      priceId: selectedPrice.price_id,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      baseUrl,
    });

    return session.url;
    }).then(url => { if (url !== undefined) res.json({ url }); });
  } catch (err: any) {
    console.error("CHECKOUT_CREATE_SESSION_ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/checkout/session/:sessionId  — fulfils order + returns details
router.get("/checkout/session/:sessionId", async (req, res) => {
  const { sessionId } = req.params;
  try {
    const order = await fulfillOrder(sessionId);
    res.json(order);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
