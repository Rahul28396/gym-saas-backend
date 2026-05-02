import { ObjectId, WithId, Collection } from "mongodb";
import { Member } from "../models/member.model";

export class MemberRepository {
  constructor(private collection: Collection<Member>) {}

  async findAll(): Promise<WithId<Member>[]> {
    return await this.collection.find({}).toArray();
  }

  async findById(id: ObjectId): Promise<WithId<Member> | null> {
    return await this.collection.findOne({ _id: id });
  }

  async create(data: Member): Promise<WithId<Member>> {
    const now = new Date();

    const result = await this.collection.insertOne({
      ...data,
      createdAt: now,
      updatedAt: now,
    });

    const created = await this.findById(result.insertedId);
    if (!created) throw new Error("Creation failed");

    return created;
  }

  async update(
    id: ObjectId,
    data: Partial<Member>
  ): Promise<WithId<Member> | null> {
    const result = await this.collection.findOneAndUpdate(
      { _id: id },
      { $set: { ...data, updatedAt: new Date() } },
      { returnDocument: "after" }
    );

    return result; // ✅ FIXED
  }

  async delete(id: ObjectId): Promise<number> {
    const result = await this.collection.deleteOne({ _id: id });
    return result.deletedCount ?? 0;
  }
}