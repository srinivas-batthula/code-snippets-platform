// web/src/models/Snippet.ts
import mongoose, { Schema } from "mongoose";

export interface ISnippet extends mongoose.Document {
    title: string;
    description?: string;
    code: string;
    publisherId: mongoose.Schema.Types.ObjectId | string;
    language?: string;
    tags?: string[];

    createdAt: Date;
    updatedAt: Date;
}

const SnippetSchema = new Schema<ISnippet>(
    {
        title: { type: String, index: true, required: true },
        description: { type: String, default: "" },
        code: { type: String, required: true },
        publisherId: {
            type: Schema.Types.ObjectId,
            ref: "users",
            index: true,
            required: true,
        },
        language: { type: String, default: "text" },
        tags: { type: [String], default: [] },
    },
    { timestamps: true },
);

export default mongoose.models.snippets ||
    mongoose.model<ISnippet>("snippets", SnippetSchema);
