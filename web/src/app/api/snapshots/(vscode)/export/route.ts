// web/src/app/api/snapshots/(vscode)/export/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/dbConnect';
import Snapshot from '@/models/Snapshot';
import { middleware } from '@/helpers/extension_middleware';

const MAX_SNAPSHOT_SIZE = 100_000; // ~100KB (covers 'settings.json + keybindings.json + workspaceConfig')...
const MAX_EXTENSIONS_COUNT = 200;  // extensions limit ~200

export async function POST(req: Request) {
    try {
        const resp = await middleware(req); // `PAT-token` auth from 'VSCode Extension'...
        if (!resp || !resp.success || !resp.user) {
            return NextResponse.json(
                { ok: false, message: resp.message || 'Unauthorized, Please Do Login to Upload!' },
                { status: resp.status || 401 }
            );
        }
        const user = resp.user;

        const body = await req.json();
        const { title, description = '', settings = {}, extensions = [], keybindings = [] } = body || {};

        // Validate required fields
        if ((!title || typeof title !== 'string' || title.trim().length === 0) || (!Array.isArray(extensions) || extensions.length === 0)) {
            return NextResponse.json({ ok: false, message: 'Missing `title` / `extensions` in request body!' }, { status: 400 });
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

        await connectDB();

        const snapshot = await Snapshot.create({
            title: title || `Snapshot from ${user.username}`,
            description,
            settings,
            extensions,
            keybindings,
            publisherId: user._id,
            publisherName: user.username,
        });

        return NextResponse.json(
            {
                ok: true,
                id: snapshot._id.toString(),
                url: `${process.env.NEXT_PUBLIC_API_URL || ''}/snapshots/${snapshot._id.toString()}`,
                message: 'Snapshot uploaded successfully!',
            },
            { status: 201 }
        );
    } catch (err: any) {
        // console.error(err);
        return NextResponse.json({ ok: false, message: err.message || 'Snapshot upload failed!' }, { status: 500 });
    }
}
