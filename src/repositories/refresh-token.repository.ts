import { Collection, Db, ObjectId, WithId } from "mongodb";
import { RefreshToken } from "../models/refresh-token.model";

export class RefreshTokenRepository {
  refreshTokenCollection: Collection<WithId<RefreshToken>>;

  constructor(private db: Db) {
    this.refreshTokenCollection = this.db.collection<WithId<RefreshToken>>("refresh_tokens")
  }

  async create(data: any) {
    return this.refreshTokenCollection.insertOne(data);
  }

  async find(token: string) {
    return this.refreshTokenCollection.findOne({ token });
  }

  async delete(token: string) {
    return this.refreshTokenCollection.deleteOne({ token });
  }

  async deleteByUser(userId: ObjectId) {
    return this.refreshTokenCollection.deleteMany({ userId });
  }
}