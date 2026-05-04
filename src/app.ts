import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import { errorHandler } from "./utils/error-handler";
import { requestLogger } from "./middleware/request-logger.middleware";

// Routers
import { createMembersRouter } from "./routes/member.router";
import { createPlansRouter } from "./routes/plan.router";
import { createAuthRouter } from "./routes/auth.router";

// Middleware
import { AuthenticationMiddleware } from "./middleware/authentication.middleware";
import { AppContext } from "./types/app-context.type";

export const createApp = async (context: AppContext) => {
  configDotenv();

  const app = express();

  const corsOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173")
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
  const { authService } = context.services;

  app.use("/api/auth", createAuthRouter(context));
  app.use("/api/members", AuthenticationMiddleware(authService), createMembersRouter(context));
  app.use("/api/plans", AuthenticationMiddleware(authService), createPlansRouter(context));

  // Error handler (last)
  app.use(errorHandler);

  return app;
};