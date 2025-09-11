import mongoose, { Schema, Document, Model } from "mongoose";

// Interface
export interface IAuth extends Document {
    state: string,
    done: boolean;
    userId?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Schema
const userSchema = new Schema<IAuth>(
    {
        state: { type: String, required: true, unique: true },
        done: { type: Boolean, required: true },
        userId: { type: String },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 600, // This doc. is auto-deleted after 600 seconds (= 10 minutes) from it's Creation-Time...
        },
    },
    { timestamps: true }
);

// Model export
const Auth: Model<IAuth> =
    mongoose.models.extension_auth || mongoose.model<IAuth>("extension_auth", userSchema);
export default Auth;
