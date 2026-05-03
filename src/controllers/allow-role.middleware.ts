import { Response, NextFunction } from "express";
import { RequestWithUser } from "../types/auth.types";

export const allowRoles = (...roles: string[]) => {
    return (req: RequestWithUser, res: Response, next: NextFunction) => {
        
        const type = req.user?.type

        if (!type) {
            throw new Error('Invalid user type')
        }

        if (!roles.includes(type)) {
            return res.status(403).json({ message: "Forbidden" });
        }

        next();
    };
};