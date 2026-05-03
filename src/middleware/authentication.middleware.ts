import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWTPayload, RequestWithUser } from "../types/auth.types";

export const AuthenticationMiddleware = (req: RequestWithUser, res: Response, next: NextFunction) => {
    // Implement authentication logic here (e.g., check JWT token)
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1]; // Assuming "Bearer <token>" format

    if (!token) {
        return res.status(401).json({ message: "Token missing" });
    }

    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET is not defined");
        }

        const decoded = jwt.verify(token, secret) as JWTPayload;
        req.user = decoded; // Assuming the token contains the user's information

        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};