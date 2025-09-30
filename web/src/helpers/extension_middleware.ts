// src/helpers/extension_middleware.ts
import { connectDB } from '@/lib/dbConnect';
import crypto from "crypto";
import User from '@/models/User';

export async function middleware(req: Request) {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1]; // `Bearer <token>` from VSCode-Extension...

    if (!token) {
        return {
            success: false,
            message: 'Token Not Found!',
            status: 404
        }
    }
    try {
        await connectDB();
        const user = await User.findOne({ token });
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

export async function generateCryptoToken() {
    const rawToken = crypto.randomBytes(32).toString("hex"); // 64 hex chars ~ 256 bits token...
    return rawToken;
}
