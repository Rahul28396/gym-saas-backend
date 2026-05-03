import { ObjectId } from "mongodb";
import { Request } from "express";

export type UserType = "admin" | "trainer" | "member";

export type JWTPayload = {
    id?: ObjectId;
    email?: string;
    role?: UserType;
}

export interface RequestWithUser extends Request {
    user?: JWTPayload;
}