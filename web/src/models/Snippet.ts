// web/src/models/Snippet.ts
import mongoose, { Schema } from 'mongoose';

export interface ISnippet extends mongoose.Document {
    _id: mongoose.Schema.Types.ObjectId | string,
    title: string;
    description?: string;

    code: string;
    lang: string;
    tags?: string[];

    publisherId: mongoose.Schema.Types.ObjectId | string;
    publisherName: string,

    createdAt: Date;
    updatedAt: Date;
};

const SnippetSchema = new Schema<ISnippet>(
    {
        title: { type: String, required: true },
        description: { type: String, default: '' },

        code: { type: String, required: true },
        
        lang: { type: String, default: 'text' },
        tags: { type: [String], default: [] },

        publisherId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
        publisherName: { type: String, required: true, index: true },
    },
    { timestamps: true }
);

SnippetSchema.index({ createdAt: -1, _id: -1 }); // for 'cursor-based sorting'...
SnippetSchema.index({ lang: 1, createdAt: -1 });
SnippetSchema.index({ tags: 1, createdAt: -1 });
SnippetSchema.index({ title: "text", description: "text" }); // for `$text` search...

export default mongoose.models.snippets || mongoose.model<ISnippet>('snippets', SnippetSchema);
