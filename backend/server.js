import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

import authRoutes       from "./routes/auth.js";
import catalogRoutes    from "./routes/catalog.js";
import chatRoutes       from "./routes/chat.js";
import analyticsRoutes  from "./routes/analytics.js";
import widgetRoutes     from "./routes/widget.js";
import onboardingRoutes from "./routes/onboarding.js";

const app = express();
const PORT = process.env.PORT || 4000;
const __dirname = dirname(fileURLToPath(import.meta.url));

// FIX 1: Validate critical env vars on startup
const REQUIRED_ENV = ["GROQ_API_KEY", "SUPABASE_URL", "SUPABASE_SERVICE_KEY", "JWT_SECRET"];
const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
if (missing.length) {
  console.error("MISSING ENV VARS:", missing.join(", "));
  console.error("Copy .env.example to .env and fill all values.");
  process.exit(1);
}

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

app.use(cors({
  origin: (origin, callback) => callback(null, true),
  credentials: true,
}));

app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200,
  message: { error: "Too many requests, please try again later." }
}));

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// Serve widget JS
app.use("/widget", express.static(join(__dirname, "../widget")));

// Routes
app.use("/api/auth",       authRoutes);
app.use("/api/catalog",    catalogRoutes);
app.use("/api/chat",       chatRoutes);
app.use("/api/analytics",  analyticsRoutes);
app.use("/api/widget",     widgetRoutes);
app.use("/api/onboarding", onboardingRoutes);

// Keep-alive ping
app.get("/ping", (req, res) => res.json({ status: "awake", time: new Date().toISOString() }));
app.get("/health", (req, res) => res.json({ status: "ok" }));

// 404
app.use((req, res) => res.status(404).json({ error: "Route not found" }));

// FIX 1: Global error handler — always return JSON, never crash
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err?.message || err);
  res.status(500).json({ error: "Internal server error. Please try again." });
});

// FIX 1: Catch unhandled promise rejections — prevent silent crashes
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection:", reason);
});

app.listen(PORT, () => {
  console.log(`ShopMind v2 backend running on port ${PORT}`);
  console.log(`Widget: http://localhost:${PORT}/widget/shopmind-widget.js`);
});
