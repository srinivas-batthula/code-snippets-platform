import {connectDB} from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { generateCryptoToken } from "@/helpers/extension_middleware";


export async function POST(request: Request) {
    await connectDB();

    try {
        const { username, code } = await request.json();

        const decodedUsername = decodeURIComponent(username);
        //find user from db
        const user = await UserModel.findOne({
            username: decodedUsername,
        });
        
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, {
                status: 404
            })
        }

        const codeVerified = user.otp === code;
        const isVerifyCodeNotExpiried = (user.otp_expiry) ? (new Date(user.otp_expiry) > new Date()) : false;

        if (codeVerified && isVerifyCodeNotExpiried) {
            const token = await generateCryptoToken();  // Add a unique Token to connect to VSCode Extension...
            user.token = token;
            user.is_verified = true;
            user.otp = undefined;
            user.otp_expiry = undefined;
            await user.save();

            return Response.json({
                success: true,
                message: "User verified successfully"
            }, {
                status: 200
            });
        }
        else if (codeVerified && !isVerifyCodeNotExpiried) {
            return Response.json({
                success: false,
                message: "Verification code expired, Please signup again"
            }, {
                status: 400
            });

        }
        return Response.json({
            success: false,
            message: "Incorrect verification code"
        }, {
            status: 400
        });
        //Check code and expiry date
        //if code and time not expired save user

    } catch (error) {
        // console.log("error checking verification code:", error);
        return Response.json({
            success: false,
            message: "Verification code failed"
        }, {
            status: 500
        })
    }
};
