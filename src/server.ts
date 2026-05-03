import { configDotenv } from "dotenv";
import { createApp } from "./app";
import { closeDatabaseConnection, connectToDatabase } from "./config/database";
import { createAppContext } from "./context/app.context";
import logger from "./utils/logger";

async function startServer() {
  configDotenv();
  try {

    logger.info("Starting gym-saas backend API...");

    // Connect to MongoDB database
    logger.info("Connecting to MongoDB...");
    const database = await connectToDatabase();
    logger.info("Connected to MongoDB successfully");

    const appContext = createAppContext(database);

    const app = await createApp(appContext);

    app.listen(process.env.PORT || 3001, () => {
      logger.info(`Server running on http://localhost:${process.env.PORT || 3001}`);
    });

    /**
     * Graceful Shutdown Handler
     * Ensures the application shuts down cleanly when terminated
     */
    process.on("SIGINT", () => {
      logger.info("Received SIGINT. Shutting down gracefully...");
      closeDatabaseConnection();
      process.exit(0);
    });

    process.on("SIGTERM", () => {
      logger.info("Received SIGTERM. Shutting down gracefully...");
      closeDatabaseConnection();
      process.exit(0);
    });
  } catch (err) {
    logger.error("Startup error:", err);
    process.exit(1);
  }
}

startServer();