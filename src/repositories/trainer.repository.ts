import { Collection, Db, ObjectId, WithId } from "mongodb";
import { Trainer } from "../models/trainer.model";
import { CreateTrainerData } from "../types/trainer.types";
import { User } from "../models/user.model";
import { Member } from "../models/member.model";
import logger from "../utils/logger";

export class TrainerRepository {
  private trainerCollection: Collection<Trainer>;
  private userCollection: Collection<User>;
  private membersCollection: Collection<Member>;

  constructor(private db: Db) {
    this.trainerCollection = this.db.collection<Trainer>('trainers');
    this.userCollection = this.db.collection<User>('users');
    this.membersCollection = this.db.collection<Member>('members');
  }

  async create(trainer: CreateTrainerData): Promise<WithId<Trainer>> {
    const now = new Date();

    if (!trainer.email) {
      throw new Error('Email is missing');
    }

    const existing = await this.userCollection.findOne({ email: trainer.email });

    if (existing) {
      throw new Error("Trainer already exists");
    }

    // provide sensible defaults so frontend can send minimal payload
    const password = trainer.password || Math.random().toString(36).slice(2, 10);
    const imageUrl = trainer.imageUrl || '';
    const type = trainer.type || 'trainer';
    const salary = trainer.salary ?? 0;
    const specialization = trainer.specialization || '';
    const experience = trainer.experience ?? 0;
    const certifications = trainer.certifications || [];
    const bio = trainer.bio || '';
    const availability = trainer.availability || [];
    const isActive = trainer.isActive ?? true;

    // create user document
    const newUser: Omit<User, '_id'> = {
      name: trainer.name || '',
      email: trainer.email,
      phone: trainer.phone || '',
      password,
      imageUrl,
      type,
      tokenVersion: 0,
      createdAt: now,
      updatedAt: now
    };

    const userResult = await this.userCollection.insertOne(newUser);
    const userId = userResult.insertedId;

    // create trainer document
    const newTrainer: Omit<Trainer, '_id'> = {
      userId,
      salary,
      specialization,
      experience,
      certifications,
      bio,
      availability,
      isActive
    };

    const trainerResult = await this.trainerCollection.insertOne(newTrainer);

    return {
      _id: trainerResult.insertedId,
      ...newTrainer
    };
  }

  async findAll(): Promise<WithId<any>[]> {
    const trainers = await this.trainerCollection.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "members",
          localField: "_id",
          foreignField: "trainerId",
          as: "assignedMembers"
        }
      },
      {
        $addFields: {
          memberCount: { $size: { $ifNull: ["$assignedMembers", []] } }
        }
      },
      {
        $project: {
          userId: 1,
          salary: 1,
          specialization: 1,
          experience: 1,
          isActive: 1,
          memberCount: 1,
          "user.name": 1,
          "user.email": 1,
          "user.phone": 1
        }
      }
    ]).toArray();

    return trainers;
  }

  async findById(id: ObjectId): Promise<WithId<any> | null> {
    try{
      const trainers = await this.trainerCollection.aggregate([
        {
          $match: { _id: id }
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user"
          }
        },
        {
          $unwind: { path: "$user", preserveNullAndEmptyArrays: true }
        },
        {
          $lookup: {
            from: "members",
            localField: "_id",
            foreignField: "trainerId",
            as: "assignedMembers"
          }
        },
        {
          $addFields: {
            memberCount: { $size: { $ifNull: ["$assignedMembers", []] } }
          }
        },
        {
          $project: {
            salary: 1,
            specialization: 1,
            experience: 1,
            isActive: 1,
            bio: 1,
            availability: 1,
            userId: 1,
            memberCount: 1,
            "user.name": 1,
            "user.email": 1,
            "user.phone": 1
          }
        }
      ]).toArray();

      if(!trainers.length){
        throw new Error('No trainer found!!')
      }

      return trainers[0];
    }catch(err){
      logger.error(err)
      throw err;
    }
  }

  // async update(trainerId: string, updateData: Partial<Trainer>): Promise<Trainer | null> {
    
  // }

  // async delete(trainerId: string): Promise<boolean> {
     
  // }

  async assignTrainerToMember(trainerId: string, memberId: string): Promise<void> {
    const tId = new ObjectId(trainerId);
    const mId = new ObjectId(memberId);

    // ensure trainer exists
    const trainer = await this.trainerCollection.findOne({ _id: tId });
    if (!trainer) throw new Error('Trainer not found');

    const result = await this.membersCollection.updateOne({ _id: mId }, { $set: { trainerId: tId } });
    if (result.matchedCount === 0) throw new Error('Member not found');
  }

  async removeTrainerFromMember(trainerId: string, memberId: string): Promise<void> {
    const mId = new ObjectId(memberId);
    await this.membersCollection.updateOne({ _id: mId, trainerId: new ObjectId(trainerId) }, { $unset: { trainerId: "" } });
  }

  async getMembersByTrainer(trainerId: string): Promise<any[]> {
    const tId = new ObjectId(trainerId);
    const members = await this.membersCollection.aggregate([
      { $match: { trainerId: tId } },
      { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "user" } },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      { $project: { userId: 1, planId: 1, status: 1, planStartDate: 1, planExpiryDate: 1, "user.name": 1, "user.email": 1 } }
    ]).toArray();

    return members;
  }

}