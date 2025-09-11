// web/src/app/api/auth/start/route.ts
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectDB } from '@/lib/dbConnect';
import Auth from '@/models/Extension_Auth';


export async function GET() {
    // 1) generate a random state to correlate OAuth request and callback
    const state = crypto.randomBytes(16).toString('hex');

    // 2) store pending entry with creation time (demo)
    try {
        await connectDB();
        await Auth.create({ state, done: false });
    }
    catch (err) {
        return NextResponse.json({ authUrl: null, state }, { status: 500 });
    }

    // 3) build GitHub authorize URL with client_id, redirect_uri and state
    const clientId = process.env.VSCODE_GITHUB_CLIENT_ID;
    const redirect = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/callback`;
    const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirect)}&scope=read:user user:email&state=${state}`;

    // 4) return authUrl + state for extension to open the browser and poll status
    return NextResponse.json({ authUrl: url, state }, { status: 200 });
}
