import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import { errorHandler } from "./utils/errorHandler";
import { requestLogger } from "./middleware/requestLogger.middleware";
import logger from "./utils/logger";

// Routers
import { createMembersRouter } from "./routes/member.router";
import { createPlansRouter } from "./routes/plan.router";
import { connectToDatabase } from "./config/database";
import { createAuthRouter } from "./routes/auth.router";

// Middleware
import { AuthenticationMiddleware } from "./middleware/authentication.middleware";

export const createApp = async () => {
  configDotenv();
  logger.info("Starting gym-saas backend API...");

  // Connect to MongoDB database
  logger.info("Connecting to MongoDB...");
  await connectToDatabase();
  logger.info("Connected to MongoDB successfully");

  const app = express();

  const corsOrigins = (process.env.CORS_ORIGINS || "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim());

  app.use(
    cors({
      origin: corsOrigins.length === 1 ? corsOrigins[0] : corsOrigins,
      credentials: true,
    })
  );

  // Body parsing
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));

  // Logging
  app.use(requestLogger);

  //use DB-dependent routers
  app.use("/api/auth", createAuthRouter());
  app.use("/api/members", AuthenticationMiddleware, createMembersRouter());
  app.use("/api/plans", AuthenticationMiddleware, createPlansRouter());

  // Error handler (last)
  app.use(errorHandler);

  return app;
};