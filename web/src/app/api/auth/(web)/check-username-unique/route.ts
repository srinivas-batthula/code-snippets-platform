import { connectDB } from '@/lib/dbConnect';
import UserModel from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    if (!username) {
        return NextResponse.json({ message: "Username is required" }, { status: 400 });
    }

    await connectDB();
    try {
        const existingUserByUsername = await UserModel.findOne({ username });
        if (existingUserByUsername) {   // If a user with this `username` is already existed...
            return NextResponse.json(
                {
                    success: false,
                    message: 'Username already taken!',
                },
                {
                    status: 400,
                },
            );
        }
        return NextResponse.json(
            {
                success: true,
                message: 'Username is Valid!',
            },
            {
                status: 200,
            },
        );

    } catch (error) {
        // console.error('Error Registering user', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Error while Validating username!',
            },
            {
                status: 500,
            },
        );
    }
};
