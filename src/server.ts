import { createApp } from "./app";
import { closeDatabaseConnection, connectToDatabase } from "./config/database";
import logger from "./utils/logger"


async function startServer() {
  try {

    const app = await createApp();

    app.listen(process.env.PORT || 3001, () => {
      logger.info(`Server running on http://localhost:${process.env.PORT || 3001}`);
      // logger.info(`API documentation available at http://localhost:${process.env.PORT || 3001}/api-docs`);
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