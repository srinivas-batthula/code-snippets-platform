// web/src/app/api/snippets/(vscode)/upload/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/dbConnect';
import Snippet from '@/models/Snippet';
import { middleware } from '@/helpers/extension_middleware';

const MAX_SNIPPET_SIZE = 10_000; // characters (10KB approx)


export async function POST(req: Request) {
    try {
        const resp = await middleware(req);     // Authorization Check for the 'PAT-token' received from VSCode-Extension...
        if (!resp || !resp.success || !resp.user) return NextResponse.json({ ok: false, message: resp.message || 'Unauthorized, Please Do Login to Upload!' }, { status: resp.status || 401 });

        const user = resp.user;     // User returned, after Authorization-Check...

        const body = await req.json();
        const { code, title, language, tags = [] } = body || {};

        // Validate code presence and size
        if ((!code || typeof code !== 'string' || code.trim().length === 0) || (!title || typeof title !== 'string' || title.trim().length === 0)) {
            return NextResponse.json({ ok: false, message: 'Missing `code` / `title` in request body!' }, { status: 400 });
        }

        if (code.length > MAX_SNIPPET_SIZE) {   // Validate 'code-snippet' size...
            return NextResponse.json(
                {
                    ok: false,
                    message: `Snippet too large. Max allowed size is ${MAX_SNIPPET_SIZE} characters.`,
                },
                { status: 413 } // `413` Payload Too Large
            );
        }

        await connectDB();

        const snippet = await Snippet.create({
            title: title || `Snippet from ${user.username}`,
            code,
            language: language || 'text',
            tags,
            publisherId: user._id
        });

        return NextResponse.json({
            ok: true,
            id: snippet._id.toString(),
            url: `${process.env.NEXT_PUBLIC_API_URL || ''}/snippets/${snippet._id.toString()}`,
            message: 'Snippet uploaded successfully!',
        }, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ ok: false, message: err.message || 'Upload failed!' }, { status: 500 });
    }
}
