import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthRepository } from "../repositories/auth.repository";
import { User } from "../models/user.model";
import { JWTPayload } from "../types/auth.types";
import { ObjectId } from "mongodb";

export class AuthService {
    constructor(private authRepository: AuthRepository) { }


    async login(email: string, password: string) {
        // Implement login logic here
        const user = await this.authRepository.findByEmail(email);

        if (!user) {
            throw new Error("User not found");
        }

        // Here you would normally check the password and generate a token
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new Error("Invalid credentials");
        }

        const secret = process.env.JWT_SECRET;

        if (!secret) {
            throw new Error("JWT_SECRET is not defined");
        }

        const payload: JWTPayload = { 
            id: user._id as ObjectId, 
            email: user.email, 
            role: user.type 
        };

        // implement token generation logic here (e.g., JWT)
        const token = jwt.sign(payload, secret, { expiresIn: "1h" });

        const { password: _, ...safeUser } = user; // Exclude password from response

        return { user: safeUser, token };
    }

    async register(newUser: User) {
        // Implement registration logic here
        const existingUser = await this.authRepository.findByEmail(newUser.email);

        if (existingUser) {
            throw new Error("Email already in use");
        }

        // Implement registration logic here
        const hashedPassword = await bcrypt.hash(newUser.password, 10);

        const updatedUser = {
            ...newUser,
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const user = await this.authRepository.create(updatedUser);
        return user;
    }        

    async logout() {
        // Implement logout logic here (e.g., invalidate token)
        // Since JWTs are stateless, you would typically handle logout on the client side by deleting the token

    }

    async refreshToken() {
        // Implement token refresh logic here
    }

    async getProfile(email: string): Promise<User | null> {
        // Implement profile retrieval logic here
        const user = await this.authRepository.findByEmail(email);
        return user;
    }
}
