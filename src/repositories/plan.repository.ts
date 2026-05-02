// repositories/plan.repository.ts

import { ObjectId, WithId, Collection } from "mongodb";
import { Plan } from "../models/plan.model";

export class PlanRepository {
  constructor(private collection: Collection<Plan>) {}

  findAll(): Promise<WithId<Plan>[]> {
    return this.collection.find({}).toArray();
  }

  findById(id: ObjectId): Promise<WithId<Plan> | null> {
    return this.collection.findOne({ _id: id });
  }

  async create(data: Plan): Promise<WithId<Plan>> {
    const now = new Date();

    const result = await this.collection.insertOne({
      ...data,
      createdAt: now,
      updatedAt: now,
    });

    const created = await this.findById(result.insertedId);
    if (!created) throw new Error("Plan creation failed");

    return created;
  }

  update(
    id: ObjectId,
    data: Partial<Plan>
  ): Promise<WithId<Plan> | null> {
    return this.collection.findOneAndUpdate(
      { _id: id },
      { $set: { ...data, updatedAt: new Date() } },
      { returnDocument: "after" }
    );
  }

  async delete(id: ObjectId): Promise<number> {
    const result = await this.collection.deleteOne({ _id: id });
    return result.deletedCount ?? 0;
  }
}