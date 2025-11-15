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

// ==== API Routes ====
app.use("/api/auth", authRoutes);
app.use("/api/costs", costRoutes);
app.use("/api/income", incomeRoutes);

// ==== STATIC FRONTEND ====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../frontend")));

// Catch-All nur für das Frontend — NICHT für /api!
app.get("*", (req, res, next) => {
  if (req.originalUrl.startsWith("/api")) return next();
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// ==== Serverstart ====
app.listen(PORT, () => console.log(`🚀 Server läuft auf Port ${PORT}`));
