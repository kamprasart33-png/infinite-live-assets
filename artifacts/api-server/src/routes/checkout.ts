import { Router, type IRouter } from "express";
import {
  createCheckoutSession,
  fulfillOrder,
} from "../services/checkout.service";
import { db } from "@workspace/db";
import { tracks } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

// POST /api/checkout/create-session
router.post("/checkout/create-session", async (req, res) => {
  const { trackId, trackTitle, licenseType, priceId, customerName, customerEmail } =
    req.body;

  if (!trackId || !priceId || !customerName || !customerEmail || !licenseType) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  try {
    const [track] = await db.select().from(tracks).where(eq(tracks.id, Number(trackId)));
    if (!track) { res.status(404).json({ error: "Track not found" }); return; }
    if (!track.fileUrl) {
      res.status(409).json({ error: "Audio download is not ready for this track. Please check back later." });
      return;
    }
    const domain = process.env.REPLIT_DOMAINS?.split(",")[0];
    const baseUrl =
      process.env.FRONTEND_URL ||
      (domain ? `https://${domain}` : `${req.protocol}://${req.get("host")}`);

    const session = await createCheckoutSession({
      trackId: Number(trackId),
      trackTitle: track.title,
      licenseType: String(licenseType),
      priceId: String(priceId),
      customerName: String(customerName),
      customerEmail: String(customerEmail),
      baseUrl,
    });

    res.json({ url: session.url });
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
