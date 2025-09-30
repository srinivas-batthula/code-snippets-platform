// web/src/app/api/auth/(vscode)/verify-token/route.ts
import { connectDB } from "@/lib/dbConnect";
import UserModel from "@/models/User";

export async function POST(request: Request) {
    try {
        await connectDB();
        const { token } = await request.json();

        const decodedToken = decodeURIComponent(token);
        //find user from db
        const user = await UserModel.findOne({
            token: decodedToken,
        });
        if (!user) {
            return Response.json({
                ok: false,
                message: "User not found with your Token!"
            }, {
                status: 404
            })
        }

        return Response.json({
            ok: true,
            message: "Token verified successfully!",
            token: user.token,
            username: user.username,
        }, {
            status: 200
        });

    } catch (error) {
        // console.log("error checking verification code:", error);
        return Response.json({
            ok: false,
            message: "Verification Token failed"
        }, {
            status: 500
        })
    }
};
