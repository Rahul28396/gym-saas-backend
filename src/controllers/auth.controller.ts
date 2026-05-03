import { Request, Response } from "express";
import { createSuccessResponse } from "../utils/error-handler";
import { User } from "../models/user.model";
import { AuthService } from "../services/auth.service";
import { RequestWithUser } from "../types/auth.types";

export default class AuthController {
    constructor(private authService: AuthService) { }

    register = async (req: Request, res: Response) => {
        const { name, email, phone, password, imageUrl } = req.body;
        const newUser: User = {
            email,
            password,
            name,
            phone,
            imageUrl,
            type: "admin",
            createdAt: new Date(),
            updatedAt: new Date(),
            tokenVersion: 1
        };
        const user = await this.authService.register(newUser);
        res.json(createSuccessResponse(user, "Registration successful"));
    };

    login = async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const user = await this.authService.login(email, password);

        return res.json(createSuccessResponse(user, "Login successful"));
    };

    refreshToken = async (req: Request, res: Response) => {
        const { refreshToken } = req.body;
        const token = await this.authService.refreshToken(refreshToken);
        res.json(token);
    };

    logout = async (req: Request, res: Response) => {
        const { refreshToken } = req.body;
        await this.authService.logout(refreshToken);
        res.json(createSuccessResponse(null, "Logout successful"));
    };

    logoutAll = async (req: RequestWithUser, res: Response) => {
        if(!req.user?.id){
            return res.status(400).json({ message: "User information is missing in the request" });
        }
        await this.authService.logoutAll(req.user?.id);
        res.json(createSuccessResponse(null, "Logout from all devices"));
    }

    getProfile = async (req: RequestWithUser, res: Response) => {
        if (!req.user || !req.user.email) {
            return res.status(400).json({ message: "User information is missing in the request" });
        }

        const profile = await this.authService.getProfile(req.user.email);

        if (!profile) {
            throw new Error('No user found!!')
        }

        const { password, ...safeProfile } = profile;

        res.json(createSuccessResponse(safeProfile, "Profile fetched"));
    };

    updateProfile = async (req: RequestWithUser, res: Response) => {
        // Implement profile update logic here

        res.json(createSuccessResponse(null, "Profile updated"));
    };
}
