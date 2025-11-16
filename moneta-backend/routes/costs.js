import express from "express";
const router = express.Router();
import Cost from "../models/Cost.js";
import authMiddleware from "../middleware/authMiddleware.js";

// GET all costs
router.get("/", authMiddleware, async (req, res) => {
  try {
    const costs = await Cost.find().sort({ createdAt: -1 });
    res.json(costs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new cost
router.post("/", authMiddleware, async (req, res) => {
  const { kosten, name, kategorie, costType } = req.body;

  const newCost = new Cost({ kosten, name, kategorie, costType });

  try {
    const savedCost = await newCost.save();
    res.status(201).json(savedCost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE cost
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await Cost.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Kosten nicht gefunden" });
    res.json({ message: "Kosten gelöscht" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
