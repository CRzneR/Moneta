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
app.use(express.json());
app.use(cors());

// ==== MongoDB Verbindung ====
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB verbunden"))
  .catch((err) => console.error("❌ MongoDB Fehler:", err));

// ====== Pfade berechnen ======
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ====== STATIC FILES ======

// 1) frontend als Root verfügbar machen
app.use(express.static(path.join(__dirname, "../frontend")));

// 2) /pages Ordner separat verfügbar machen
app.use("/pages", express.static(path.join(__dirname, "../frontend/pages")));

// ====== API ROUTES ======
app.use("/api/auth", authRoutes);
app.use("/api/costs", costRoutes);
app.use("/api/income", incomeRoutes);

// ====== Catch-all für falsche Routen (aber NICHT API) ======
app.get("*", (req, res, next) => {
  if (req.originalUrl.startsWith("/api")) return next();
  res.sendFile(path.join(__dirname, "../frontend/pages/index.html"));
});

// ====== Server Start ======
app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf http://localhost:${PORT}`);
});
