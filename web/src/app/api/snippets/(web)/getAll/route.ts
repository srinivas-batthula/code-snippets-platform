// web/src/app/api/snippets/(web)/getAll/route.ts
import { NextResponse } from "next/server";
import mongoose from 'mongoose';
import { connectDB } from "@/lib/dbConnect";
import Snippet from "@/models/Snippet";

// GetAll `code-snippets` with pagination, filters & search...
//*--- `Cursor-based pagination` for 'Infinite Scrolling' ---*//
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url); // Search Query-Params (`/api/snippets/getAll?id=..&user=..&language=..&tag=..&search=..&cursor=..`)

        const limit = Math.min(20, parseInt(searchParams.get("limit") || "1")); // default `limit=10`
        const language = searchParams.get("language");
        const tag = searchParams.get("tag");
        const search = searchParams.get("search");
        const cursor = searchParams.get("cursor");
        const username = searchParams.get("user");
        const id = searchParams.get("id"); // Snippet-ID...

        await connectDB();

        // Build `match`--{query-obj} stage...
        const match: any = {};
        if (id) {
            match._id = new mongoose.Types.ObjectId(id);   // Convert to ObjectId
        }
        else {
            if (username) match.publisherName = username;
            if (language) match.lang = language;
            if (tag) match.tags = { $in: [tag] };
            if (search) match.$text = { $search: search };  // This text-`search` is performed on 'title + description'...
            if (cursor) { // Only `fetch` items older than / after 'cursor'...
                const [createdAtStr, id] = cursor.split("_");   // ?cursor=2024-09-27T12:00:00.000Z_6517fa12345678abcd123456 ...
                const createdAtDate = new Date(createdAtStr);

                match.$or = [   // Compound condition for precise pagination...
                    { createdAt: { $lt: createdAtDate } },
                    {
                        createdAt: createdAtDate,
                        _id: { $lt: new mongoose.Types.ObjectId(id) },
                    },
                ];
            }
        }

        const sortStage: any = search
            ? { score: { $meta: "textScore" }, createdAt: -1, _id: -1 }
            : { createdAt: -1, _id: -1 };

        // Aggregation `pipeline` with '$facet'...
        const pipeline: any[] = [
            { $match: match },
            ...(search ? [{ $addFields: { score: { $meta: "textScore" } } }] : []),  // `Rank` those filtered-snippets to sort them efficiently...
            { $sort: sortStage },
            {
                $facet: {
                    snippets: [
                        { $limit: limit + 1 }, // fetch an `extra-snippet` for 'next-cursor'...
                        {
                            $project: {
                                _id: 1,
                                title: 1,
                                description: 1,
                                // code: 1,     // Use `/import/[id]` route to get all fields of a particular snippet... 
                                lang: 1,
                                tags: 1,
                                createdAt: 1,
                                updatedAt: 1,
                                publisherId: 1,
                                publisherName: 1,
                            },
                        },
                    ],
                    totalCount: [
                        { $count: "count" }
                    ]
                }
            }
        ];

        const result = await Snippet.aggregate(pipeline).exec();

        const snippetsData = result[0].snippets as any[];
        const totalCount = result[0].totalCount[0]?.count || 0;

        // Handle nextCursor...
        const hasNextPage = snippetsData.length > limit;
        if (hasNextPage) snippetsData.pop();
        const nextCursor = hasNextPage
            ? `${snippetsData[snippetsData.length - 1].createdAt.toISOString()}_${snippetsData[snippetsData.length - 1]._id.toString()}`
            : null;

        return NextResponse.json(
            {
                success: true,
                snippets: snippetsData.map((s) => ({
                    id: s._id.toString(),
                    title: s.title,
                    description: s.description,
                    language: s.lang,
                    tags: s.tags,
                    createdAt: s.createdAt,
                    updatedAt: s.updatedAt,
                    publisherId: s.publisherId,
                    publisherName: s.publisherName || "Unknown"
                })),
                pagination: {
                    totalSnippets: totalCount,
                    limit,
                    totalPages: Math.ceil(totalCount / limit),
                    hasNextPage,
                    nextCursor,
                },
            },
            { status: 200 }
        );

    } catch (err: any) {
        // console.error("Error fetching snippets:", err);
        return NextResponse.json(
            { success: false, message: err.message || "Failed to fetch Snippets!" },
            { status: 500 }
        );
    }
}
