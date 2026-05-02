import { ObjectId } from "mongodb";
import { User } from "./user.model";

export interface Member extends User {
  name: string;
  email: string;
  phone: string;
  password: string;
  imageUrl: string;
  type: "admin" | "trainer" | "member";
  createdAt: Date;
  updatedAt: Date;
  startDate: string;
  endDate: string;
  status: string;
  planId: ObjectId;
}