// routes/plan.routes.ts

import { Router } from "express";
import { getCollection } from "../config/database";
import { PlanService } from "../services/plan.service";
import { PlanController } from "../controllers/plan.controller";
import { Plan } from "../models/plan.model";
import { PlanRepository } from "../repositories/plan.repository";
import { validateObjectIdMiddleware } from "../middleware/validateObjectId.middleware";

export const createPlansRouter = (): Router => {

    const router = Router();

    // Dependency Injection
    const planCollection = getCollection<Plan>("plans");

    const planRepository = new PlanRepository(planCollection);
    const planService = new PlanService(planRepository);
    const planController = new PlanController(planService);

    // Routes
    router.get("/", planController.getPlans);
    router.get("/:id", validateObjectIdMiddleware, planController.getPlan);
    router.post("/", planController.createPlan);
    router.put("/:id", validateObjectIdMiddleware, planController.updatePlan);
    router.delete("/:id", validateObjectIdMiddleware, planController.deletePlan);

    return router;
};