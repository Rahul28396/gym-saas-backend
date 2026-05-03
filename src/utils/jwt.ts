import { WithId } from "mongodb";
import { User } from "../models/user.model";
import jwt from 'jsonwebtoken'
import { JWTPayload } from "../types/auth.types";

export const generateAccessToken = (user: WithId<User>): string => {

    if (!user) {
        throw new Error('Invalid user');
    }

    if (!user._id) {
        throw new Error('No user');
    }

    const payload: JWTPayload = {
        id: user._id,
        type: user.type,
        email: user.email,
        tokenVersion: user.tokenVersion
    }

    return jwt.sign(payload, _getTokenSecret('access'), { expiresIn: '15m' })
}

export const generateRefreshToken = (user: WithId<User>): string => {

    if (!user) {
        throw new Error('Invalid user');
    }

    if (!user._id) {
        throw new Error('No user');
    }

    const payload = {
        userId: user._id
    };

    return jwt.sign(payload, _getTokenSecret('refresh'), { expiresIn: '7d' })
}

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, _getTokenSecret('access'))
}

export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, _getTokenSecret('refresh'))
}

const _getTokenSecret = (tokenType: 'access' | 'refresh'): string => {

    const tokenSecrectKey = tokenType === 'access' 
    ? process.env.JWT_ACCESS_TOKEN_SECRET 
    : process.env.JWT_REFRESH_TOKEN_SECRET

    if (!tokenSecrectKey) {
        throw new Error('Invalid secrect token');
    }

    return tokenSecrectKey;
}