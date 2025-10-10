// web/src/app/api/snapshots/(web)/getAll/route.ts
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/dbConnect";
import Snapshot from "@/models/Snapshot";

// GetAll `snapshots` with pagination, filters & search...
//*--- `Cursor-based pagination` for 'Infinite Scrolling' ---*//
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url); // Query-Params: `/api/snapshots/getAll?id=..&user=..&search=..&cursor=..`

        const limit = Math.min(20, parseInt(searchParams.get("limit") || "10")); // default `limit=10` per page
        const username = searchParams.get("user");
        const search = searchParams.get("search");
        const cursor = searchParams.get("cursor");
        const id = searchParams.get("id");

        await connectDB();

        // Build `match`--{query-obj} stage...
        const match: any = {};
        if (id) {
            match._id = new mongoose.Types.ObjectId(id);
        } else {
            if (username) match.publisherName = username;
            if (search) match.$text = { $search: search }; // text index → on title + description
            if (cursor) {
                const [createdAtStr, id] = cursor.split("_");
                const createdAtDate = new Date(createdAtStr);

                match.$or = [
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

        // Aggregation pipeline with `$facet...`
        const pipeline: any[] = [
            { $match: match },
            ...(search ? [{ $addFields: { score: { $meta: "textScore" } } }] : []),  // `Rank` those filtered-snapshots to sort them efficiently...
            { $sort: sortStage },
            {
                $facet: {
                    snapshots: [
                        { $limit: limit + 1 }, // fetch an `extra-snapshot` for 'next-cursor'...
                        {
                            $project: {
                                _id: 1,
                                title: 1,
                                description: 1,
                                publisherId: 1,
                                publisherName: 1,
                                // settings: 1,     // Use `/import/[id]` route to get all fields of a particular 'snippet' to reduce load... 
                                // extensions: 1,
                                // keybindings: 1,
                                // workspaceConfig: 1,
                                createdAt: 1,
                                updatedAt: 1,
                            },
                        },
                    ],
                    totalCount: [{ $count: "count" }],
                },
            },
        ];

        const result = await Snapshot.aggregate(pipeline).exec();

        const snapshotsData = result[0].snapshots as any[];
        const totalCount = result[0].totalCount[0]?.count || 0;

        // Handle nextCursor
        const hasNextPage = snapshotsData.length > limit;
        if (hasNextPage) snapshotsData.pop();
        const nextCursor = hasNextPage
            ? `${snapshotsData[snapshotsData.length - 1].createdAt.toISOString()}_${snapshotsData[snapshotsData.length - 1]._id.toString()}`
            : null;

        return NextResponse.json(
            {
                success: true,
                snapshots: snapshotsData.map((s) => ({
                    id: s._id.toString(),
                    title: s.title,
                    description: s.description || null,

                    publisherId: s.publisherId,
                    publisherName: s.publisherName || "Unknown",

                    createdAt: s.createdAt,
                    updatedAt: s.updatedAt,
                })),
                pagination: {
                    totalCount,
                    limit,
                    totalPages: Math.ceil(totalCount / limit),

                    hasNextPage,
                    nextCursor,
                },
            },
            { status: 200 }
        );
    } catch (err: any) {
        // console.error("Error fetching snapshots:", err);
        return NextResponse.json(
            { success: false, message: err.message || "Failed to fetch Snapshots!" },
            { status: 500 }
        );
    }
}
