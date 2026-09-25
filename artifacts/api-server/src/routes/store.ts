import { Router, type IRouter } from "express";
import { storage } from "../storage";
import { db } from "@workspace/db";
import { orders, tracks } from "@workspace/db/schema";
import { and, eq } from "drizzle-orm";
import { requireAdmin } from "../middlewares/authMiddleware";

const router: IRouter = Router();

// GET /api/store/tracks — public track listing
router.get("/store/tracks", async (_req, res) => {
  try {
    const rows = await db.select().from(tracks);
    res.json(rows.map(({ fileUrl, ...track }) => ({ ...track, audioReady: Boolean(fileUrl) })));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/store/license-prices — Stripe license products + prices
router.get("/store/license-prices", async (_req, res) => {
  try {
    const rows = await storage.getLicensePrices();
    res.json(rows);
  } catch {
    // Return empty list if stripe schema not ready yet
    res.json([]);
  }
});

// Attach the original audio file after uploading it to durable storage.
router.put("/tracks/:id/audio", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const fileUrl = req.body?.fileUrl;
  if (!Number.isSafeInteger(id) || id < 1 || typeof fileUrl !== "string") {
    res.status(400).json({ error: "Valid track ID and fileUrl required" });
    return;
  }
  try {
    const url = new URL(fileUrl);
    if (url.protocol !== "https:" || url.username || url.password) throw new Error("Invalid URL");
    if (fileUrl.length > 500) throw new Error("URL too long");
  } catch {
    res.status(400).json({ error: "Provide an HTTPS audio file URL (500 characters maximum)" });
    return;
  }
  const [track] = await db.update(tracks).set({ fileUrl }).where(eq(tracks.id, id)).returning();
  if (!track) { res.status(404).json({ error: "Track not found" }); return; }
  res.json({ id: track.id, title: track.title, audioReady: true });
});

// GET /api/tracks/:id/download?session_id=... — only the paid session grants access.
router.get("/tracks/:id/download", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const sessionId = req.query.session_id;
    if (!Number.isSafeInteger(id) || id < 1 || typeof sessionId !== "string" || !sessionId) {
      res.status(400).json({ error: "Track ID and purchase session required" });
      return;
    }
    const [order] = await db.select({ id: orders.id }).from(orders).where(and(
      eq(orders.stripeSessionId, sessionId), eq(orders.trackId, id), eq(orders.status, "completed"),
    ));
    if (!order) { res.status(403).json({ error: "No paid order for this track" }); return; }
    const [track] = await db
      .select()
      .from(tracks)
      .where(eq(tracks.id, id));

    if (!track) {
      res.status(404).json({ error: "Track not found" });
      return;
    }

    if (track.fileUrl) {
      res.setHeader("Cache-Control", "private, no-store");
      res.redirect(track.fileUrl);
    } else {
      res.status(404).json({
        message: "Audio file not yet uploaded for this track.",
        track: track.title,
      });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
