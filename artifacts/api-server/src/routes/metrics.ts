import { Router } from "express";
import { getDashboardMetrics, getRevenueHistory, getDailySales } from "../services/metrics.service";

const router = Router();

router.get("/metrics/dashboard", async (_req, res) => {
  try {
    const data = await getDashboardMetrics();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch dashboard metrics" });
  }
});

router.get("/metrics/revenue-history", async (_req, res) => {
  try {
    const data = await getRevenueHistory();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch revenue history" });
  }
});

router.get("/metrics/daily-sales", async (_req, res) => {
  try {
    const data = await getDailySales();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch daily sales" });
  }
});

export default router;
