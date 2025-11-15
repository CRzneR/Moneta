const express = require("express");
const router = express.Router();
const Cost = require("../models/Cost");

// GET all costs
router.get("/", async (req, res) => {
  try {
    const costs = await Cost.find().sort({ createdAt: -1 });
    res.json(costs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new cost
router.post("/", async (req, res) => {
  const { kosten, name, kategorie, costType } = req.body;
  const newCost = new Cost({ kosten, name, kategorie, costType });

  try {
    const savedCost = await newCost.save();
    res.status(201).json(savedCost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE cost by id
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Cost.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Kosten nicht gefunden" });
    res.json({ message: "Kosten gelöscht" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
