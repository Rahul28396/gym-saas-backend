// services/plan.service.ts

import { ObjectId, WithId } from "mongodb";
import { Plan } from "../models/plan.model";
import { ApiError } from "../utils/api-error";
import { PlanRepository } from "../repositories/plan.repository";

export class PlanService {
  constructor(private repo: PlanRepository) {}

  getPlans(): Promise<WithId<Plan>[]> {
    return this.repo.findAll();
  }

  async getPlanById(id: ObjectId): Promise<WithId<Plan>> {
    const plan = await this.repo.findById(id);
    if (!plan) throw new ApiError(404, "Plan not found");
    return plan;
  }

  createPlan(data: Plan) {
    return this.repo.create(data);
  }

  async updatePlan(
    id: ObjectId,
    data: Partial<Plan>
  ): Promise<WithId<Plan>> {
    const updated = await this.repo.update(id, data);

    if (!updated) {
      throw new ApiError(404, "Plan not found");
    }

    return updated;
  }

  async deletePlan(id: ObjectId): Promise<void> {
    const count = await this.repo.delete(id);

    if (count === 0) {
      throw new ApiError(404, "Plan not found");
    }
  }
}