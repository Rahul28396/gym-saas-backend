import bcrypt from "bcrypt";
import { User } from "../models/user.model";
import { ObjectId, WithId } from "mongodb";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt";
import { UserRepository } from "../repositories/user.repository";
import { RefreshTokenRepository } from "../repositories/refresh-token.repository";

export class AuthService {
    constructor(
        private userRepository: UserRepository,
        private refreshTokenRepo: RefreshTokenRepository
    ) { }

    async register(newUser: User): Promise<WithId<User>> {
        // Implement registration logic here
        const existingUser = await this.userRepository.findByEmail(newUser.email);

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

        const user = await this.userRepository.create(updatedUser);
        return user;
    }

    async login(email: string, password: string) {
        // Implement login logic here
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw new Error("User not found");
        }

        // Here you would normally check the password and generate a token
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new Error("Invalid credentials");
        }

        // implement token generation logic here
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Store refresh token in the db
        await this.refreshTokenRepo.create({
            userId: user._id,
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            createdAt: new Date()
        });

        const userDetailsToBeShown = {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            phone: user.phone,
            imageUrl: user.imageUrl,
            role: user.type
        }

        return { token: accessToken, user: userDetailsToBeShown };
    }

    async refreshToken(refreshToken: string) {
        // 1. verify JWT signature
        const decoded: any = verifyRefreshToken(refreshToken);

        // 2. check in DB
        const stored = await this.refreshTokenRepo.find(refreshToken);
        if (!stored) throw new Error("Invalid refresh token");

        // 3. check expiry
        if (new Date() > stored.expiresAt) {
            await this.refreshTokenRepo.delete(refreshToken);
            throw new Error("Refresh token expired");
        }

        // 4. get user
        const user = await this.userRepository.findById(decoded.userId);
        if (!user) throw new Error("User not found");

        // 5. ROTATE TOKEN (best practice)
        await this.refreshTokenRepo.delete(refreshToken);

        const newRefreshToken = generateRefreshToken(user);

        await this.refreshTokenRepo.create({
            userId: user._id,
            token: newRefreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            createdAt: new Date()
        });

        return {
            accessToken: generateAccessToken(user),
            refreshToken: newRefreshToken
        };
    }

    async logout(refreshToken: string) {
        await this.refreshTokenRepo.delete(refreshToken);
    }

    async logoutAll(userId: ObjectId) {
        await this.refreshTokenRepo.deleteByUser(userId);
        await this.userRepository.incrementTokenVersion(userId);
    }

    async getProfile(email: string): Promise<WithId<User> | null> {
        // Implement profile retrieval logic here
        const user = await this.userRepository.findByEmail(email);
        return user;
    }
}
