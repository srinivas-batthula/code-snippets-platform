// web/src/app/api/snapshots/(vscode)/import/[id]/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { connectDB } from '@/lib/dbConnect';
import Snapshot from '@/models/Snapshot';
import mongoose from 'mongoose';

// This `api-endpoint` is used by both 'website & Extension' to get a snapshot by ID...
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        if (!id) {
            return NextResponse.json({ ok: false, message: 'Missing `id` of Snapshot!' }, { status: 400 });
        }

        await connectDB();

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ ok: false, message: 'Invalid Snapshot ID format!' }, { status: 400 });
        }

        const snapshot = await Snapshot.findById(id).lean();
        if (!snapshot || Array.isArray(snapshot)) {
            return NextResponse.json({ ok: false, message: `Snapshot not found with ID: ${id}` }, { status: 404 });
        }

        // Return minimal snapshot fields (avoid leaking DB internals)
        const safe = {
            id: snapshot._id?.toString(),
            title: snapshot.title,
            description: snapshot.description,

            settings: snapshot.settings,
            extensions: snapshot.extensions,
            keybindings: snapshot.keybindings,

            publisherName: snapshot.publisherName,
            publisherId: snapshot.publisherId,

            createdAt: snapshot.createdAt,
            updatedAt: snapshot.updatedAt,
        };

        return NextResponse.json({ ok: true, snapshot: safe }, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ ok: false, message: err.message || 'Snapshot fetch failed' }, { status: 500 });
    }
}
