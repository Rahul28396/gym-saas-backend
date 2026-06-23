import { Router } from "express";
import { AppContext } from "../types/app-context.type";
import { TrainerController } from "../controllers/trainer.controller";
import { validateObjectIdMiddleware } from "../middleware/validate-object-id.middleware";

export const createTrainersRouter = (context: AppContext): Router => {
  const router = Router();

  const {trainerService} = context.services;
  const trainerController = new TrainerController(trainerService);

  // Routes
  router.get("/", trainerController.getTrainers);
  router.get("/:id", validateObjectIdMiddleware, trainerController.getTrainer);
  router.post("/", trainerController.createTrainer);
//   router.put("/:id", validateObjectIdMiddleware, trainerController.updateTrainer);
//   router.delete("/:id", validateObjectIdMiddleware, trainerController.deleteTrainer);

  return router;
};