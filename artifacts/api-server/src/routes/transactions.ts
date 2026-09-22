import { Router } from "express";
import { getRecentTransactions, getActiveLicenses, getLicensesByType } from "../services/transactions.service";

const router = Router();

router.get("/transactions/recent", async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const data = await getRecentTransactions(limit);
    res.json(data);
  } catch (err) {
    console.error("[transactions/recent]", err instanceof Error ? err.message : err);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

router.get("/transactions/active-licenses", async (_req, res) => {
  try {
    const data = await getActiveLicenses(50);
    res.json(data);
  } catch (err) {
    console.error("[transactions/active-licenses]", err instanceof Error ? err.message : err);
    res.status(500).json({ error: "Failed to fetch active licenses" });
  }
});

router.get("/transactions/by-type", async (_req, res) => {
  try {
    const data = await getLicensesByType();
    res.json(data);
  } catch (err) {
    console.error("[transactions/by-type]", err instanceof Error ? err.message : err);
    res.status(500).json({ error: "Failed to fetch license breakdown" });
  }
});

export default router;
