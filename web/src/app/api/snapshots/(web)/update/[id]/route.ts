// web/src/app/api/snapshots/(web)/update/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from 'mongoose';
import { connectDB } from '@/lib/dbConnect';
import Snapshot from '@/models/Snapshot';

const MAX_SNAPSHOT_SIZE = 100_000; // ~100KB (covers 'settings.json + keybindings.json + workspaceConfig')...
const MAX_EXTENSIONS_COUNT = 200;  // extensions limit ~200

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = params?.id;
        if (!id) {
            return NextResponse.json({ success: false, message: 'Missing `id`!' }, { status: 400 });
        }

        const session = await getServerSession(authOptions); // Check if user is 'logged-in'...
        if (!session || !session.user) {
            return NextResponse.json({ success: false, message: 'Unauthorized, Please login to update snapshot!' }, { status: 401 });
        }

        await connectDB();
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ success: false, message: 'Invalid Snapshot ID format!' }, { status: 400 });
        }
        const snapshotId = new mongoose.Types.ObjectId(id);   // Convert to ObjectId

        const body = await req.json();
        const { title, description, settings, extensions, keybindings } = body || {};

        // Build dynamic update-object (only update fields provided by user and valid)
        const updateData: Record<string, any> = {};
        if (title && typeof title === 'string' && title.trim().length > 0)
            updateData.title = title;
        if (description && typeof description === 'string' && description.trim().length > 0)
            updateData.description = description;
        if (settings && typeof settings === 'object')
            updateData.settings = settings;
        if (extensions && Array.isArray(extensions))
            updateData.extensions = extensions;
        if (keybindings && Array.isArray(keybindings))
            updateData.keybindings = keybindings;

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ success: false, message: 'Missing valid fields in request body to update!' }, { status: 400 });
        }

        // Validate the `limits / sizes` of 'Snapshots & Extensions'...
        if (extensions.length > MAX_EXTENSIONS_COUNT) {
            return NextResponse.json(
                { ok: false, message: `Too many extensions, Max allowed is ${MAX_EXTENSIONS_COUNT}!` },
                { status: 413 }
            );
        }

        const snapshotSize = JSON.stringify({ settings, keybindings }).length;
        if (snapshotSize > MAX_SNAPSHOT_SIZE) {
            return NextResponse.json(
                { ok: false, message: `Snapshot too large, Max allowed size is ${MAX_SNAPSHOT_SIZE} characters!` },
                { status: 413 }
            );
        }

        const snapshot = await Snapshot.findByIdAndUpdate(snapshotId, updateData, { new: true });
        if (!snapshot) {
            return NextResponse.json({ success: false, message: 'Snapshot not found!' }, { status: 404 });
        }
        // Return minimal safe fields
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

        return NextResponse.json({
            success: true,
            snapshot: safe,
            message: 'Snapshot updated successfully!',
        }, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ success: false, message: err.message || 'Snapshot update failed!' }, { status: 500 });
    }
}
