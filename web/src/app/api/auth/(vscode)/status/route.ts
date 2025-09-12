// web/src/app/api/auth/status/route.ts
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import { connectDB } from '@/lib/dbConnect';
import Auth from '@/models/Extension_Auth';


export async function GET(req: Request) {
    // read state from querystring
    const url = new URL(req.url);
    const state = url.searchParams.get('state');
    if (!state) return NextResponse.json({ ok: false, message: '`state` field Not Found in URL-searchParams!' }, { status: 400 });

    try {
        // check pending map
        await connectDB();
        const entry = await Auth.findOne({ state });
        // console.log("Polling state:", state);

        if (!entry || !entry.done) return NextResponse.json({ ok: false, message: 'Your `state` is Still under Pending, Please Try again Later!' }, { status: 200 });

        // entry.done === true, generate a JWT for the extension (short TTL)
        const user = await User.findById(entry.userId);
        if (!user) return NextResponse.json({ ok: false, message: 'User Not Found in DB!' }, { status: 404 });

        // jwt signature uses JWT_SECRET; payload minimal (uid + login)
        const payload = { userId: (user as any)._id.toString() };
        const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '30d' });

        // cleanup pending (single-use)
        await Auth.findByIdAndDelete(entry._id);

        // return JWT to extension (the extension stores it into SecretStorage)
        return NextResponse.json({ ok: true, token, username: user.username, message: 'PAT Access-Token generated successfully.' }, { status: 200 });
    }
    catch (err) {
        return NextResponse.json({ ok: false, message: (err as any).message || 'Error in `/api/auth/status`!' }, { status: 500 });
    }
}
