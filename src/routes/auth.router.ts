import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import { AuthenticationMiddleware } from "../middleware/authentication.middleware";
import { AppContext } from "../types/app-context.type";

export const createAuthRouter = (context: AppContext) => {
  const router = Router();

  const { authService } = context.services;

  const authController = new AuthController(authService);

  // inject service into middleware (factory pattern)
  const authMiddleware = AuthenticationMiddleware(authService);

  router.post("/register", authController.register);
  router.post("/login", authController.login);
  router.post('/refresh' , authController.refreshToken );

  router.post("/logout", authMiddleware, authController.logout);
  router.post("/logout-all", authMiddleware, authController.logoutAll)
  router.get("/profile", authMiddleware, authController.getProfile);

  return router;
};
