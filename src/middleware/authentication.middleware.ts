import { Response, NextFunction } from "express";
import { JWTPayload, RequestWithUser } from "../types/auth.types";
import { verifyAccessToken } from "../utils/jwt";
import { AuthService } from "../services/auth.service";
import logger from "../utils/logger";

export const AuthenticationMiddleware = (authService: AuthService) => {
    
    return async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization?.split(" ")[1];
           
            if (!token) throw new Error("No token");

            const decoded: JWTPayload = verifyAccessToken(token) as JWTPayload;
            
            const user = decoded.email && await authService.getProfile(decoded.email);
            
            if (!user) throw new Error("Unauthorized");

            if (user.tokenVersion !== decoded.tokenVersion) {
                throw new Error("Token expired");
            }

            const userPayload: JWTPayload = {
                id: user._id,
                email: user.email,
                tokenVersion: user.tokenVersion,
                type: user.type
            }

            req.user = userPayload

            next();
        } catch(error) {
            logger.error(error);
            res.status(401).json({ message: "Unauthorized" });
        }
    };
};