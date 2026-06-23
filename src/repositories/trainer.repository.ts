import { Collection, Db, ObjectId, WithId } from "mongodb";
import { Trainer } from "../models/trainer.model";
import { CreateTrainerData } from "../types/trainer.types";
import { User } from "../models/user.model";
import logger from "../utils/logger";

export class TrainerRepository {
  private trainerCollection: Collection<Trainer>;
  private userCollection: Collection<User>;

  constructor(private db: Db) {
    this.trainerCollection = this.db.collection<Trainer>('trainers');
    this.userCollection = this.db.collection<User>('users');
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

    // create user document
    const newUser: Omit<User, '_id'> = {
      name: trainer.name,
      email: trainer.email,
      phone: trainer.phone,
      password: trainer.password,
      imageUrl: trainer.imageUrl,
      type: trainer.type,
      tokenVersion: 0,
      createdAt: now,
      updatedAt: now
    };

    const userResult = await this.userCollection.insertOne(newUser);
    const userId = userResult.insertedId;

    // create trainer document
    const newTrainer: Omit<Trainer, '_id'> = {
      userId,
      salary: trainer.salary,
      specialization: trainer.specialization,
      experience: trainer.experience,
      certifications: trainer.certifications,
      bio: trainer.bio,
      availability: trainer.availability,
      isActive: trainer.isActive
    };

    const trainerResult = await this.trainerCollection.insertOne(newTrainer);

    return {
      _id: trainerResult.insertedId,
      ...newTrainer
    };
  }

  async findAll(): Promise<WithId<any>[]> {
    // Implementation for finding all members with user and plan data using aggregate
    const members = await this.trainerCollection.aggregate([
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
      {
        $project: {
            userId: 1,
            salary: 1,
            specialization: 1,
            experience: 1,
            isActive: 1,

            "user.name": 1,
            "user.email": 1,
            "user.phone": 1,
        }
      }
    ]).toArray();

    return members;
  }

  async findById(id: ObjectId): Promise<WithId<any> | null> {
    try{
      const member = await this.trainerCollection.aggregate([
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
          $project: {
            salary: 1,
            specialization: 1,
            experience: 1,
            isActive: 1,
            bio: 1,
            availability: 1,
            userId: 1,

            "user.name": 1,
            "user.email": 1,
            "user.phone": 1,
          }
        }
      ]).toArray();

      if(!member.length){
        throw new Error('No user found!!')
      }

      return member;
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
    // This method would contain logic to associate a trainer with a member.
    // The actual implementation would depend on how you model the relationship between trainers and members in your database.
    // For example, you might have a field in the member document that references the trainer's ObjectId.
  }

  async removeTrainerFromMember(trainerId: string, memberId: string): Promise<void> {
    // This method would contain logic to disassociate a trainer from a member.
    // Similar to the assignTrainerToMember method, the implementation would depend on your data model.
  }

  async getMembersByTrainer(trainerId: string): Promise<any[]> {
    // This method would contain logic to retrieve all members associated with a specific trainer.
    // The implementation would depend on how you model the relationship between trainers and members in your database.
    // For example, you might query the members collection for documents that reference the trainer's ObjectId.
    return [];
  }

}