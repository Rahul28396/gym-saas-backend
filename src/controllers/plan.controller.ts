// controllers/plan.controller.ts

import { Request, Response } from "express";
import { PlanService } from "../services/plan.service";
import { success } from "../utils/response";
import { RequestWithObjectId } from "../middleware/validateObjectId.middleware";

export class PlanController {
  constructor(private service: PlanService) {}

  getPlans = async (_req: Request, res: Response) => {
    const plans = await this.service.getPlans();
    res.json(success(plans, `Found ${plans.length} plans`));
  };

  getPlan = async (req: RequestWithObjectId, res: Response) => {
    const plan = await this.service.getPlanById(req.objectId!);
    res.json(success(plan, `Found plan: ${plan.name}`));
  };

  createPlan = async (req: Request, res: Response) => {
    const plan = await this.service.createPlan(req.body);
    res.status(201).json(success(plan, "Plan created"));
  };

  updatePlan = async (req: RequestWithObjectId, res: Response) => {
    const updated = await this.service.updatePlan(
      req.objectId!,
      req.body
    );

    res.json(success(updated, "Plan updated"));
  };

  deletePlan = async (req: RequestWithObjectId, res: Response) => {
    await this.service.deletePlan(req.objectId!);
    res.json(success(undefined, "Plan deleted"));
  };
}