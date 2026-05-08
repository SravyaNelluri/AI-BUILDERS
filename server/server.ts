import dotenv from "dotenv";

// Only load .env file in development
// Render/Vercel provide env vars automatically in production
if (!process.env.VERCEL && !process.env.RENDER && process.env.NODE_ENV !== "production") {
  dotenv.config();
  console.log("[server] Loaded .env file for development");
}

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import userRouter from "./routes/userRouters";
import projectRouter from "./routes/projectRoutes";
import { stripeWebhook } from "./controllers/stripeWebhook";

// Validate critical environment variables
const requiredEnvVars = ["DATABASE_URL", "BETTER_AUTH_SECRET", "BETTER_AUTH_URL"];

const missingEnvVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error(
    "[server] ERROR: Missing required environment variables:",
    missingEnvVars.join(", ")
  );
}

// Log crashes clearly
process.on("unhandledRejection", (reason) => {
  console.error("[server] Unhandled promise rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("[server] Uncaught exception:", err);
});

const app = express();

const port = Number(process.env.PORT) || 3000;

// ✅ CORS configuration
// Add frontend URL in Render env:
// TRUSTED_ORIGINS=https://ai-builders-1.onrender.com
const allowedOrigins =
  process.env.TRUSTED_ORIGINS?.split(",").map((origin) => origin.trim()) || [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "https://ai-builders-1.onrender.com",
  ];

const corsOptions: cors.CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    // Allow requests with no origin like Postman/curl
    if (!origin) {
      return callback(null, true);
    }

    // ✅ Allow localhost, configured origins, Vercel, and Render domains
    if (
      allowedOrigins.includes(origin) ||
      origin.includes(".vercel.app") ||
      origin.includes(".onrender.com")
    ) {
      return callback(null, true);
    }

    console.log("[server] CORS blocked origin:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie", "X-Requested-With"],
};

app.use(cors(corsOptions));

// ✅ Handle preflight requests
app.options("*", cors(corsOptions));

// Stripe requires raw body for signature verification
app.post("/api/stripe", express.raw({ type: "application/json" }), stripeWebhook);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

let authHandlerPromise: Promise<(req: Request, res: Response) => unknown> | null = null;

const getAuthHandler = async () => {
  if (!authHandlerPromise) {
    authHandlerPromise = (async () => {
      const { getAuth } = await import("./lib/auth");
      const auth = await getAuth();
      const { toNodeHandler } = await import("better-auth/node");
      return toNodeHandler(auth);
    })();
  }

  return authHandlerPromise;
};

// Better Auth routes
app.use("/api/auth", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const handler = await getAuthHandler();
    return handler(req, res);
  } catch (error) {
    next(error);
  }
});

app.get("/", (req: Request, res: Response) => {
  res.send("Server is Live!");
});

app.get("/api", (req: Request, res: Response) => {
  res.send("API is Live!");
});

// API routes
app.use("/api/user", userRouter);
app.use("/api/project", projectRouter);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("[server] Error:", err);

  res.status(500).json({
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
});

// Start server except on Vercel
if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(
      `[server] Running on http://localhost:${port} in ${
        process.env.NODE_ENV || "development"
      } mode`
    );
  });
}

export default app;