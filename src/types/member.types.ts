import { ObjectId } from "mongodb";

export interface CreateMemberData {
    email: string;
    name: string;
    phone: string;
    password: string;
    imageUrl: string;
    type: "member";
    planId: ObjectId;
    planStartDate: string;
    planExpiryDate: string;
    status: string;
}