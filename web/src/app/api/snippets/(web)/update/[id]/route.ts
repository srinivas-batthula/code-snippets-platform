// web/src/app/api/snippets/(web)/update/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from 'mongoose';
import { connectDB } from '@/lib/dbConnect';
import Snippet from '@/models/Snippet';

const MAX_SNIPPET_SIZE = 10_000; // characters (10KB approx)


export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = params?.id;
        if (!id) return NextResponse.json({ success: false, message: 'Missing `id`!' }, { status: 400 });

        const session = await getServerSession(authOptions);    // Checking if user is 'logged-in'...
        if (!session || !session.user) return NextResponse.json({ success: false, message: 'Unauthorized, Please Do Login to Update!' }, { status: 401 });

        await connectDB();
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ success: false, message: 'Invalid Snapshot ID format!' }, { status: 400 });
        }
        const snippetId = new mongoose.Types.ObjectId(id);   // Convert to ObjectId

        const body = await req.json();
        const { code, title, description, language, tags = [] } = body || {};

        // Building dynamic 'updateData'-obj that Only `updates` 'fields' which are provided by the `user` (and 'Valid')...
        const updateData: Record<string, string | string[]> = {};
        if (title && typeof title === 'string' && title.trim().length > 0)
            updateData.title = title;
        if (description && typeof description === 'string' && description.trim().length > 0)
            updateData.description = description;
        if (code && typeof code === 'string' && code.trim().length > 0)
            updateData.code = code;
        if (language && typeof language === 'string' && language.trim().length > 0)
            updateData.lang = language;
        if (tags && Array.isArray(tags) && tags.length > 0)
            updateData.tags = tags;

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ success: false, message: 'Missing `payload` to update in request body!' }, { status: 400 });
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

        const snippet = await Snippet.findByIdAndUpdate(snippetId, updateData, { new: true });
        if (!snippet) {
            return NextResponse.json({ success: false, message: 'Snippet not found!' }, { status: 404 });
        }
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
            message: 'Snippet Updated successfully!',
        }, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ success: false, message: err.message || 'Update failed!' }, { status: 500 });
    }
}
