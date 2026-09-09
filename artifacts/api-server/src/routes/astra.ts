import { Router } from "express";
import { handleAstraCommand } from "../services/astra.service";

const router = Router();

router.post("/astra/command", async (req, res) => {
  try {
    const { command } = req.body as { command?: string };
    if (!command || typeof command !== "string" || command.trim().length === 0) {
      return res.status(400).json({ error: "command is required" });
    }
    const result = await handleAstraCommand(command);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: "Astra command failed" });
  }
});

export default router;
