import { Request, Response } from "express";
import { createSuccessResponse } from "../utils/errorHandler";
import { User } from "../models/user.model";
import { AuthService } from "../services/auth.service";
import { RequestWithUser } from "../types/auth.types";

export default class AuthController {
    constructor(private authService: AuthService) { }

    login = async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const user = await this.authService.login(email, password);
        
        res.json(createSuccessResponse(user, "Login successful"));
    };

    register = async (req: Request, res: Response) => {
        const { name, email, phone, password, imageUrl } = req.body;
        const newUser: User = {
            email,
            password, // fill in properly
            name,
            phone,
            imageUrl,
            type: "admin",
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const user = await this.authService.register(newUser);
        res.json(createSuccessResponse(user, "Registration successful"));
    };

    logout = async (req: Request, res: Response) => {
        await this.authService.logout();
        res.json(createSuccessResponse(null, "Logout successful"));
    };

    // refreshToken = async (req: Request, res: Response) => {
    //     const token = await this.authService.refreshToken(req.body.refreshToken);
    //     res.json(createSuccessResponse(token, "Token refreshed"));
    // };

    getProfile = async (req: RequestWithUser, res: Response) => {
        if (!req.user || !req.user.email) {
            return res.status(400).json({ message: "User information is missing in the request" });
        }

        const profile = await this.authService.getProfile(req.user.email);
        res.json(createSuccessResponse(profile, "Profile fetched"));
    };

    updateProfile = async (req: RequestWithUser, res: Response) => {
        // Implement profile update logic here

        res.json(createSuccessResponse(null, "Profile updated"));
    };
}
