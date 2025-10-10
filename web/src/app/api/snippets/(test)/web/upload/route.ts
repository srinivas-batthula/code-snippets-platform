import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnect";
import Snippet from "@/models/Snippet";

const MAX_SNIPPET_SIZE = 50_000; // characters (50KB)

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { code, title, description, language, tags = [] } = body || {};

        console.log("Received data:", {
            title,
            description,
            language,
            tags,
            codeLength: code?.length,
        });

        // Validate required fields
        if (!code || typeof code !== "string" || code.trim().length === 0) {
            return NextResponse.json(
                { ok: false, message: "Code is required!" },
                { status: 400 },
            );
        }

        if (!title || typeof title !== "string" || title.trim().length === 0) {
            return NextResponse.json(
                { ok: false, message: "Title is required!" },
                { status: 400 },
            );
        }

        if (
            !description ||
            typeof description !== "string" ||
            description.trim().length === 0
        ) {
            return NextResponse.json(
                { ok: false, message: "Description is required!" },
                { status: 400 },
            );
        }

        // Validate code size
        if (code.length > MAX_SNIPPET_SIZE) {
            return NextResponse.json(
                {
                    ok: false,
                    message: `Snippet too large. Max allowed size is ${MAX_SNIPPET_SIZE} characters.`,
                },
                { status: 413 },
            );
        }

        // Validate tags
        if (tags && (!Array.isArray(tags) || tags.length === 0)) {
            return NextResponse.json(
                { ok: false, message: "At least one tag is required." },
                { status: 400 },
            );
        }

        if (tags && tags.length > 10) {
            return NextResponse.json(
                { ok: false, message: "Cannot have more than 10 tags." },
                { status: 400 },
            );
        }

        await connectDB();

        // Create snippet with a dummy publisherId for testing
        const snippet = await Snippet.create({
            title: title.trim(),
            description: description.trim(),
            code: code.trim(),
            language: language || "javascript",
            tags: Array.isArray(tags)
                ? tags
                      .filter((tag) => tag && tag.trim())
                      .map((tag) => tag.trim())
                : [],
            publisherId: "507f1f77bcf86cd799439011", // Dummy ObjectId for testing
        });

        console.log("Snippet created:", snippet._id);

        return NextResponse.json(
            {
                ok: true,
                id: snippet._id.toString(),
                message: "Snippet uploaded successfully!",
                snippet: {
                    id: snippet._id.toString(),
                    title: snippet.title,
                    description: snippet.description,
                    language: snippet.language,
                    tags: snippet.tags,
                    createdAt: snippet.createdAt,
                },
            },
            { status: 201 },
        );
    } catch (err: any) {
        console.error("Snippet upload error:", err);
        return NextResponse.json(
            {
                ok: false,
                message: err.message || "Upload failed!",
                error: err.toString(),
            },
            { status: 500 },
        );
    }
}
