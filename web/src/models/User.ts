import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

// Interface
export interface IUser extends Document {
    username: string;
    email: string;
    password?: string;
    avatar_url?: string;
    bio?: string;

    is_from_oauth: boolean;
    is_verified: boolean;
    otp?: string;
    otp_expiry?: Date;
    is_admin: boolean;
    token: string;

    last_login?: Date;
    createdAt: Date;
    updatedAt: Date;

    comparePassword(candidate: string): Promise<boolean>;
}

// Schema
const userSchema = new Schema<IUser>(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String },
        is_from_oauth: { type: Boolean, default: false }, // Set to `TRUE` If the 'user' is logged-In via 'OAuth' like Google...
        is_verified: { type: Boolean, default: false },

        avatar_url: { type: String },
        bio: { type: String },
        otp: { type: String },
        otp_expiry: { type: Date },
        token: { type: String, unique: true, index: true },

        is_admin: { type: Boolean, default: false },
        last_login: { type: Date },
    },
    { timestamps: true }
);

// Password hash middleware
userSchema.pre("save", async function (next) {
    if (this.isModified("password") && this.password) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

// Compare password method
userSchema.methods.comparePassword = function (candidate: string) {
    return bcrypt.compare(candidate, this.password!);
};

// Model export
const User: Model<IUser> =
    mongoose.models.users || mongoose.model<IUser>("users", userSchema);
export default User;
