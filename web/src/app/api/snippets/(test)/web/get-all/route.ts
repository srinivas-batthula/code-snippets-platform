import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnect";
import Snippet from "@/models/Snippet";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const language = searchParams.get("language");
        const tag = searchParams.get("tag");
        const search = searchParams.get("search");

        await connectDB();

        // Build query
        const query: any = {};

        if (language) {
            query.language = language;
        }

        if (tag) {
            query.tags = { $in: [tag] };
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }

        // Calculate skip value
        const skip = (page - 1) * limit;

        // Get snippets with pagination
        const snippets = await Snippet.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select("title description code language tags createdAt updatedAt");

        // Get total count for pagination
        console.log("Query:", snippets);
        const totalSnippets = await Snippet.countDocuments(query);
        const totalPages = Math.ceil(totalSnippets / limit);

        console.log(
            `Found ${snippets.length} snippets (page ${page} of ${totalPages})`,
        );

        return NextResponse.json(
            {
                ok: true,
                snippets: snippets.map((snippet) => ({
                    id: snippet._id.toString(),
                    title: snippet.title,
                    description: snippet.description,
                    language: snippet.language,
                    tags: snippet.tags,
                    code: snippet.code,
                    createdAt: snippet.createdAt,
                    updatedAt: snippet.updatedAt,
                })),
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalSnippets,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1,
                },
            },
            { status: 200 },
        );
    } catch (err: any) {
        console.error("Error fetching snippets:", err);
        return NextResponse.json(
            {
                ok: false,
                message: err.message || "Failed to fetch snippets!",
                error: err.toString(),
            },
            { status: 500 },
        );
    }
}
