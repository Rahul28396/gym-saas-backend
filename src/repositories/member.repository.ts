import { ObjectId, WithId, Collection } from "mongodb";
import { Member } from "../models/member.model";
import { CreateMemberData } from "../types/member.types";
import { User } from "../models/user.model";
import { Plan } from "../models/plan.model";

export class MemberRepository {
  constructor(
    private membercollection: Collection<Member>,
    private userCollection: Collection<User>,
    private plansCollection: Collection<Plan>
  ) { }

  async findAll(): Promise<WithId<any>[]> {
    // Implementation for finding all members with user and plan data using aggregate
    const members = await this.membercollection.aggregate([
      // Join with Users collection
      {
        $lookup: {
          from: "users",              // target collection
          localField: "userId",       // field in members
          foreignField: "_id",        // field in users
          as: "user"                  // output array field
        }
      },
      // Flatten user array (optional if always one user)
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },

      // Join with Plans collection
      {
        $lookup: {
          from: "plans",
          localField: "planId",
          foreignField: "_id",
          as: "plan"
        }
      },
      { $unwind: { path: "$plan", preserveNullAndEmptyArrays: true } },      
    ]).toArray();


    return members;
  }

  async findById(id: ObjectId): Promise<WithId<Member> | null> {
    return await this.membercollection.findOne({ _id: id });
  }

  async create(data: CreateMemberData): Promise<WithId<Member>> {
    const now = new Date();

    const existing = await this.userCollection.findOne({ email: data.email });

    if (existing) {
      throw new Error("Member already exists");
    }

    if (!data.planId) {
      throw new Error("No plan is selected");
    }

    const newUser: User = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      imageUrl: data.imageUrl,
      type: "member",
      createdAt: now,
      updatedAt: now,
    };

    const insertedUser = await this.userCollection.insertOne(newUser);

    const memberData: Member = {
      userId: insertedUser.insertedId,
      planId: data.planId,
      planStartDate: data.planStartDate,
      planExpiryDate: data.planExpiryDate,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    };

    const result = await this.membercollection.insertOne(memberData);

    const created = { ...memberData, _id: result.insertedId };

    if (!created) throw new Error("Creation failed");

    return created;
  }

  async update(
    id: ObjectId,
    data: Partial<Member>
  ): Promise<WithId<Member> | null> {
    const result = await this.membercollection.findOneAndUpdate(
      { _id: id },
      { $set: { ...data, updatedAt: new Date() } },
      { returnDocument: "after" }
    );

    return result; // ✅ FIXED
  }

  async delete(id: ObjectId): Promise<number> {
    const result = await this.membercollection.deleteOne({ _id: id });
    return result.deletedCount ?? 0;
  }
}