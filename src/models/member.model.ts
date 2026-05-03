import { ObjectId } from "mongodb";

export interface Member {
  userId: ObjectId;
  planId: ObjectId;

  planStartDate: string;
  planExpiryDate: string;

  status: string;

  createdAt: Date;
  updatedAt: Date;
}