const express = require("express");
const router = express.Router();
const Income = require("../models/Income");

// Alle Einnahmen abrufen
router.get("/", async (req, res) => {
  try {
    const incomes = await Income.find();
    res.json(incomes);
  } catch (error) {
    res.status(500).json({ message: "Fehler beim Laden der Einnahmen" });
  }
});

// Neue Einnahme speichern
router.post("/", async (req, res) => {
  try {
    const { source, amount, category, month } = req.body;

    const newIncome = new Income({
      source,
      amount,
      category,
      month,
    });

    await newIncome.save();
    res.status(201).json(newIncome);
  } catch (error) {
    res.status(400).json({ message: "Fehler beim Speichern der Einnahme" });
  }
});

// Einnahme löschen
router.delete("/:id", async (req, res) => {
  try {
    await Income.findByIdAndDelete(req.params.id);
    res.json({ message: "Einnahme gelöscht" });
  } catch (error) {
    res.status(500).json({ message: "Fehler beim Löschen der Einnahme" });
  }
});

module.exports = router;
