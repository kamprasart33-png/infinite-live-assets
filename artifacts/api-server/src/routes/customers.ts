import { Router } from "express";
import { getAllCustomers, getActiveCustomers, getNewestCustomers } from "../services/customers.service";

const router = Router();

router.get("/customers", async (req, res) => {
  try {
    const filter = req.query.filter as string | undefined;
    if (filter === "active") {
      const data = await getActiveCustomers(50);
      return res.json(data);
    }
    if (filter === "newest") {
      const data = await getNewestCustomers(10);
      return res.json(data);
    }
    const data = await getAllCustomers(50);
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch customers" });
  }
});

export default router;
