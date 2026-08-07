import { Router, type IRouter } from "express";
import {
  createCheckoutSession,
  fulfillOrder,
} from "../services/checkout.service";

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
    const domain = process.env.REPLIT_DOMAINS?.split(",")[0];
    const baseUrl = domain
      ? `https://${domain}`
      : `${req.protocol}://${req.get("host")}`;

    const session = await createCheckoutSession({
      trackId: Number(trackId),
      trackTitle: String(trackTitle),
      licenseType: String(licenseType),
      priceId: String(priceId),
      customerName: String(customerName),
      customerEmail: String(customerEmail),
      baseUrl,
    });

    res.json({ url: session.url });
  } catch (err: any) {
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
