import { ObjectId } from "mongodb";

export interface RefreshToken {
    userId: ObjectId,
    token: string,
    expiresAt: Date,
    createdAt: Date
}
