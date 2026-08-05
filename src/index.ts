import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { HTTPSTATUS } from "./config/http.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { envConfig } from "./config/env.config";
import { asyncHandler } from "./middlewares/asyncHandler.middleware";
import { connectDatabase } from "./config/database.config";
import passport from "./config/passport.config";
import routes from "./routes";
import webhookRouter from "./routes/webhook.route";

const app = express();

// --- CORS first ---
const FRONTEND_ORIGIN = envConfig.FRONTEND_ORIGIN || "http://localhost:5173";

const corsOptions = {
  origin: FRONTEND_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
// ------------------

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

// Webhook routes
app.use("/api/webhook", webhookRouter);

// Health check
app.get(
  "/health",
  asyncHandler(async (_req, res) => {
    res.status(HTTPSTATUS.OK).json({
      message: "Server is running",
      status: "healthy",
    });
  })
);

// Test route
app.get(
  "/test",
  asyncHandler(async (_req, res) => {
    res.status(HTTPSTATUS.OK).json({ ok: true, message: "test route works" });
  })
);

// Main API routes
app.use("/api", routes);

app.use(errorHandler);

// DB connection + start (works for both Vercel and local)
let isDbReady = false;

async function ensureDatabase() {
  if (isDbReady) return;
  await connectDatabase();
  isDbReady = true;
}

// For Vercel: ensure DB before first request
if (process.env.VERCEL) {
  ensureDatabase().catch((err) => {
    console.error("Failed to connect to database on Vercel startup:", err);
    throw err; // let Vercel see the failure clearly
  });
}

// For local: traditional listen
if (!process.env.VERCEL) {
  app.listen(envConfig.PORT, async () => {
    await ensureDatabase();
    console.log(
      `Server running on port ${envConfig.PORT} in ${envConfig.NODE_ENV} mode`
    );
  });
}

export default app;