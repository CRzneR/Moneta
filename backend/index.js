import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import passport from "passport";
import session from "express-session";
import connectMongo from "connect-mongodb-session";
import mongoose from "mongoose";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

import { buildContext } from "graphql-passport";

import mergedResolvers from "./resolvers/index.js";
import mergedTypeDefs from "./typeDefs/index.js";

import { configurePassport } from "./passport/passport.config.js";
import job from "./cron.js";

dotenv.config();
configurePassport();
job.start();

const __dirname = path.resolve();
const app = express();
const httpServer = http.createServer(app);

// === MONGO SESSION STORE ===
const MongoDBStore = connectMongo(session);
const mongoUri = process.env.MONGO_URI;

const store = new MongoDBStore({
  uri: mongoUri,
  collection: "sessions",
});

store.on("error", (err) => console.log("❌ Session-Store Fehler:", err));

// === SESSIONS ===
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
      sameSite: "none", // wichtig für Cross-Site Cookies
      secure: process.env.NODE_ENV === "production", // HTTPS only auf Render
    },
    store: store,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// === APOLLO SERVER ===
const server = new ApolloServer({
  typeDefs: mergedTypeDefs,
  resolvers: mergedResolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
  "/graphql",
  cors({
    origin: [
      "http://localhost:3000",
      process.env.CLIENT_URL || "*", // Render-Frontend erlauben
    ],
    credentials: true,
  }),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req, res }) => buildContext({ req, res }),
  })
);

// === STATIC FRONTEND ===
app.use(express.static(path.join(__dirname, "frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/dist", "index.html"));
});

// === MONGO DB VERBINDUNG ===
mongoose
  .connect(mongoUri, {
    serverSelectionTimeoutMS: 10000,
    ssl: true,
  })
  .then(() => console.log("✅ MongoDB verbunden"))
  .catch((err) => console.error("❌ MongoDB Fehler:", err));

// === SERVER START ===
const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
});
