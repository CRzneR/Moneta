const mongoose = require("mongoose");

const CostSchema = new mongoose.Schema(
  {
    kosten: { type: Number, required: true },
    name: { type: String, required: true },
    kategorie: { type: String, required: true },
    costType: { type: String, enum: ["fix", "jährlich", "variabel"], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cost", CostSchema);
