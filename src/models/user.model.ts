import { ObjectId } from "mongodb";

export interface User{
    _id?: ObjectId
    name: string;
    email: string;
    phone: string;
    password: string;
    imageUrl: string;
    type: "admin" | "trainer" | "member";
    createdAt: Date;
    updatedAt: Date;
}