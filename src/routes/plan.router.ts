import { Router } from "express";
import { PlanController } from "../controllers/plan.controller";
import { validateObjectIdMiddleware } from "../middleware/validate-object-id.middleware";
import { AppContext } from "../types/app-context.type";

export const createPlansRouter = (context: AppContext): Router => {
    const router = Router();

    const {planService} = context.services;
    const planController = new PlanController(planService);

    // Routes
    router.get("/", planController.getPlans);
    router.get("/:id", validateObjectIdMiddleware, planController.getPlan);
    router.post("/", planController.createPlan);
    router.put("/:id", validateObjectIdMiddleware, planController.updatePlan);
    router.delete("/:id", validateObjectIdMiddleware, planController.deletePlan);

    return router;
};