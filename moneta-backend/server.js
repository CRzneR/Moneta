// moneta-backend/server.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Routen importieren
import authRoutes from "./routes/auth.js";
import costRoutes from "./routes/costs.js";
import incomeRoutes from "./routes/income.js";

// ==== Initialisierung ====
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

// ==== Middleware ====
app.use(express.json()); // JSON-Body parsen
app.use(cors()); // Frontend darf anfragen senden

// ==== MongoDB Verbindung ====
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB verbunden"))
  .catch((err) => console.error("❌ MongoDB Fehler:", err));

// ==== API-Routen ====
app.use("/api/auth", authRoutes); // Login / Register
app.use("/api/costs", costRoutes); // Kostenverwaltung
app.use("/api/income", incomeRoutes); // Einnahmenverwaltung

// ==== Frontend bereitstellen ====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Statisches Frontend ausliefern
app.use(express.static(path.join(__dirname, "../frontend")));

// Catch-all: alle unbekannten Routen → index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// ==== Serverstart ====
app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf Port ${PORT}`);
});
