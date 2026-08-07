import { Router, type IRouter } from "express";
import { storage } from "../storage";
import { db } from "@workspace/db";
import { tracks } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

// GET /api/store/tracks — public track listing
router.get("/store/tracks", async (_req, res) => {
  try {
    const rows = await db.select().from(tracks);
    res.json(rows);
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

// GET /api/tracks/:id/download
router.get("/tracks/:id/download", async (req, res) => {
  try {
    const [track] = await db
      .select()
      .from(tracks)
      .where(eq(tracks.id, parseInt(req.params.id)));

    if (!track) {
      res.status(404).json({ error: "Track not found" });
      return;
    }

    if (track.fileUrl) {
      res.redirect(track.fileUrl);
    } else {
      res.status(200).json({
        message: "Audio file not yet uploaded for this track.",
        track: track.title,
      });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
