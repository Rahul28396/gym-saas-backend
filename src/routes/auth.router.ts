import { Router } from "express";
import { getCollection } from "../config/database";
import { User } from "../models/user.model";
import AuthController from "../controllers/auth.controller";
import { AuthRepository } from "../repositories/auth.repository";
import { AuthService } from "../services/auth.service";
import { AuthenticationMiddleware } from "../middleware/authentication.middleware";

export const createAuthRouter = () => {
    const router = Router();

    // Dependency Injection (runs AFTER DB connection)
    const userCollection = getCollection<User>("Users");

    const authRepository = new AuthRepository(userCollection);
    const authService = new AuthService(authRepository);
    const authController = new AuthController(authService);

    router.post("/login", authController.login);
    router.post("/register", authController.register);
    router.post("/logout", AuthenticationMiddleware, authController.logout);
    // router.post("/refresh-token", authController.refreshToken);
    router.get("/profile", AuthenticationMiddleware ,authController.getProfile);

    return router;
};
