import { Response, NextFunction } from "express";
import { JWTPayload, RequestWithUser } from "../types/auth.types";
import { verifyAccessToken } from "../utils/jwt";
import { AuthService } from "../services/auth.service";

export const AuthenticationMiddleware = (authService: AuthService) => {
    
    return async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            console.log("token", token)
            if (!token) throw new Error("No token");

            const decoded: JWTPayload = verifyAccessToken(token) as JWTPayload;
            console.log(decoded);
            const user = decoded.email && await authService.getProfile(decoded.email);
            console.log(user)
            if (!user) throw new Error("Unauthorized");

            if (user.tokenVersion !== decoded.tokenVersion) {
                throw new Error("Token expired");
            }

            (req as any).user = user;

            next();
        } catch {
            res.status(401).json({ message: "Unauthorized" });
        }
    };
};