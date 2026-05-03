import { Collection, WithId } from "mongodb";
import { User } from "../models/user.model";

export class AuthRepository {
    constructor(private userCollection: Collection<User>) {}

    async findByEmail(email: string): Promise<WithId<User> | null> {
        return await this.userCollection.findOne({ email });
    }

    async create(user: User): Promise<WithId<User>> {
        const result = await this.userCollection.insertOne(user);
        return { ...user, _id: result.insertedId };
    }

}
