// web/src/app/api/snippets/(web)/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from '@/lib/dbConnect';
import Snippet from '@/models/Snippet';
import User from '@/models/User';

const MAX_SNIPPET_SIZE = 10_000; // characters (10KB approx)


export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);    // Accessing 'user' from next-auth session...
        if (!session || !session.user) return NextResponse.json({ success: false, message: 'Unauthorized, Please Do Login to Upload!' }, { status: 401 });

        const sessionUser = session.user;     // User returned, after Authorization-Check...

        await connectDB();

        const user = await User.findOne({ email: sessionUser.email });
        if (!user) return NextResponse.json({ success: false, message: 'User Not Found!' }, { status: 403 });

        const body = await req.json();
        const { code, title, description, language, tags = [] } = body || {};

        // Validate the presence of 'code', 'title', 'language'...
        if ((!code || typeof code !== 'string' || code.trim().length === 0) || (!title || typeof title !== 'string' || title.trim().length === 0) || (!language || typeof language !== 'string' || language.trim().length === 0)) {
            return NextResponse.json({ success: false, message: 'Missing `code` / `title` / `language` in request body!' }, { status: 400 });
        }

        if (code.length > MAX_SNIPPET_SIZE) {   // Validate 'code-snippet' size...
            return NextResponse.json(
                {
                    success: false,
                    message: `Snippet too large. Max allowed size is ${MAX_SNIPPET_SIZE} characters.`,
                },
                { status: 413 } // `413` Payload Too Large
            );
        }

        const snippet = await Snippet.create({
            title: title || `Snippet from ${user.username}`,
            description,
            code,
            lang: language || 'text',
            tags,
            publisherId: user._id,
            publisherName: user.username
        });

        // Return minimal snippet fields (avoid leaking DB internals)
        const safe = {
            id: snippet._id?.toString(),
            title: snippet.title,
            description: snippet.description,
            code: snippet.code,
            language: snippet.lang,
            tags: snippet.tags,
            publisherName: snippet.publisherName,
            publisherId: snippet.publisherId,
            createdAt: snippet.createdAt,
            updatedAt: snippet.updatedAt,
        };

        return NextResponse.json({
            success: true,
            snippet: safe,
            message: 'Snippet uploaded successfully!',
        }, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ success: false, message: err.message || 'Upload failed!' }, { status: 500 });
    }
}
