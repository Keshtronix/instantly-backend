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

// --- CORS first, before any routes ---
const FRONTEND_ORIGIN = envConfig.FRONTEND_ORIGIN || "http://localhost:5173";

const corsOptions = {
  origin: FRONTEND_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
// -------------------------------------

// Body & cookie parsers
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

// Main API routes
app.use("/api", routes);

// Error handler
app.use(errorHandler);

// DB connect
if (process.env.VERCEL) {
  connectDatabase().catch((err) => {
    console.error("Failed to connect to database on Vercel startup:", err);
  });
} else {
  app.listen(envConfig.PORT, async () => {
    await connectDatabase();
    console.log(
      `Server running on port ${envConfig.PORT} in ${envConfig.NODE_ENV} mode`
    );
  });
}

export default app;