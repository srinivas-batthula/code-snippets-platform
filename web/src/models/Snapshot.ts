// web/src/models/Snapshot.ts
import mongoose, { Schema } from 'mongoose';

export interface ISnapshot extends mongoose.Document {
    _id: mongoose.Schema.Types.ObjectId | string,
    title: string;
    description?: string;

    publisherId: mongoose.Schema.Types.ObjectId | string;
    publisherName: string;

    settings: Record<string, any>; // vscode `settings.json`
    extensions: string[];          // list of `extension-IDs`
    keybindings?: Record<string, any>[]; // vscode `keybindings.json`

    createdAt: Date;
    updatedAt: Date;
};

const SnapshotSchema = new Schema<ISnapshot>(
    {
        title: { type: String, required: true },
        description: { type: String, default: '' },

        publisherId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
        publisherName: { type: String, required: true, index: true },

        settings: { type: Schema.Types.Mixed, default: {} },
        extensions: { type: [String], default: [] },
        keybindings: { type: [Schema.Types.Mixed], default: [] },
    },
    { timestamps: true }
);

// indexes for fast lookup
SnapshotSchema.index({ createdAt: -1, _id: -1 }); // for 'cursor-based sorting'...
SnapshotSchema.index({ publisherName: 1, createdAt: -1 });
SnapshotSchema.index({ title: "text", description: "text" }); // for `$text` search...

export default mongoose.models.snapshots || mongoose.model<ISnapshot>('snapshots', SnapshotSchema);
