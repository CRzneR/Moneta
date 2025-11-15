const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema({
  source: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, enum: ["Gehalt", "Nebeneinkünfte"], required: true },
  month: { type: String, required: true },
});

module.exports = mongoose.model("Income", incomeSchema);
