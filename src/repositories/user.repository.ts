import { Collection, Db, ObjectId, WithId } from "mongodb";
import { User } from "../models/user.model";

export class UserRepository {

    private userCollection: Collection<User>;

    constructor(private db: Db) {
        this.userCollection = this.db.collection<User>('users');
    }

    async create(data: User) {
        
        const res = await this.userCollection.insertOne({
            ...data,
            tokenVersion: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        return { _id: res.insertedId, ...data };
    }

    async findByEmail(email: string) {
        return this.userCollection.findOne({ email });
    }

    async findById(id: ObjectId) {
        return this.userCollection.findOne({
            _id: id
        });
    }

    async incrementTokenVersion(userId: ObjectId) {
        return this.userCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $inc: { tokenVersion: 1 } }
        );
    }
}