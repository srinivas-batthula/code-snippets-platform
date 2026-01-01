// web/src/app/api/snippets/(vscode)/import/[id]/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { connectDB } from '@/lib/dbConnect';
import Snippet from '@/models/Snippet';
import mongoose from 'mongoose';

// This `api-endpoint` is used by both 'website & Extension' to get a snippet by ID...
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        if (!id) return NextResponse.json({ ok: false, message: 'Missing `id` of Snippet!' }, { status: 400 });

        await connectDB();
        const objectId = new mongoose.Types.ObjectId(id);   // Convert to ObjectId

        const snippetWithOwner = await Snippet.findById(objectId).lean();
        if (!snippetWithOwner || Array.isArray(snippetWithOwner)) return NextResponse.json({ ok: false, message: `Snippet not found with the ID: ${id}!` }, { status: 404 });

        // Return minimal snippet fields (avoid leaking DB internals)
        const safe = {
            id: snippetWithOwner._id?.toString(),
            title: snippetWithOwner.title,
            description: snippetWithOwner.description,

            code: snippetWithOwner.code,
            language: snippetWithOwner.lang,
            tags: snippetWithOwner.tags,

            publisherName: snippetWithOwner.publisherName,
            publisherId: snippetWithOwner.publisherId,
            
            createdAt: snippetWithOwner.createdAt,
            updatedAt: snippetWithOwner.updatedAt,
        };

        return NextResponse.json({ ok: true, snippet: safe }, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ ok: false, message: err.message || 'Fetch failed' }, { status: 500 });
    }
}
