import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/dbConnect";
import User from "@/models/User";

export async function GET(
    req: NextRequest,
    { params }: { params: { username: string } },
) {
    try {
        await connectDB();

        const { username } = params;
        if (!username) {
            return NextResponse.json(
                { success: false, message: "Username not provided" },
                { status: 400 },
            );
        }

        const user = await User.findOne({ username }).lean();
        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 },
            );
        }

        // determine if requester is the same as the target user
        let isOwner = false;
        const session = await getServerSession(authOptions);
        if (session && session.user) {
            if (
                (session.user as any).username === user.username ||
                session.user.email === user.email
            ) {
                isOwner = true;
            }
        }

        // build safe payload
        const safe: any = {
            username: user.username,
            avatar_url: user.avatar_url || null,
            bio: user.bio || null,
            is_from_oauth: user.is_from_oauth,
            is_verified: user.is_verified,
            is_admin: user.is_admin,
            email: user.email,
        };
        if (isOwner) {
            safe.token = user.token || null;
            safe.last_login = user.last_login;
        }

        return NextResponse.json({ success: true, user: safe, isOwner });
    } catch (err: any) {
        return NextResponse.json(
            { success: false, message: err.message || "Server error" },
            { status: 500 },
        );
    }
}
