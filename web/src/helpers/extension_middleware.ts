// src/helpers/extension_middleware.ts
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const SECRET = process.env.JWT_SECRET!;

export async function middleware(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1]; // `Bearer <token>`

    if (!token) {
        return {
            success: false,
            message: 'Token Not Found!',
            status: 404
        }
    }
    try {
        const decoded = jwt.verify(token, SECRET);
        if (!decoded || typeof decoded !== 'object' || !('userId' in decoded)) {
            throw new Error('Invalid Token');
        }

        const user = await User.findById((decoded as jwt.JwtPayload).userId);
        if (!user) {
            throw new Error('User Not Found');
        }

        return {
            success: true,
            message: 'Token Validation Successful!',
            user
        }
    } catch (err) {
        return {
            success: false,
            message: 'Un-Authorized / Invalid Token / User (of that Token) Not Found!',
            status: 403
        };
    }
}
