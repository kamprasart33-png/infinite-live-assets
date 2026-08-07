import { Router } from "express";
import { getAllTracks, getTopSellingTracks } from "../services/tracks.service";

const router = Router();

router.get("/tracks", async (_req, res) => {
  try {
    const data = await getAllTracks();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tracks" });
  }
});

router.get("/tracks/top-selling", async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const data = await getTopSellingTracks(limit);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch top tracks" });
  }
});

export default router;
