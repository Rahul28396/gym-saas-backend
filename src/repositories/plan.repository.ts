import { ObjectId, WithId, Collection, Db } from "mongodb";
import { Plan } from "../models/plan.model";

export class PlanRepository {
  private planCollection: Collection<Plan>;

  constructor(private db: Db) {
    this.planCollection = this.db.collection<Plan>('plans')
  }

  findAll(): Promise<WithId<Plan>[]> {
    return this.planCollection.find({}).toArray();
  }

  findById(id: ObjectId): Promise<WithId<Plan> | null> {
    return this.planCollection.findOne({ _id: id });
  }

  async create(data: Plan): Promise<WithId<Plan>> {
    const now = new Date();

    const result = await this.planCollection.insertOne({
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
    return this.planCollection.findOneAndUpdate(
      { _id: id },
      { $set: { ...data, updatedAt: new Date() } },
      { returnDocument: "after" }
    );
  }

  async delete(id: ObjectId): Promise<number> {
    const result = await this.planCollection.deleteOne({ _id: id });
    return result.deletedCount ?? 0;
  }
}