import mongoose from "mongoose";
const { Schema, models } = mongoose;
const userSchema = new Schema({
    name: {
        firstname: {
            type: String,
        },
        lastname: {
            type: String,
        },
        fullname: {
            type: String,
        },
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    avatar: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    wins: {
        type: Number,
        default: 0,
    },
    losses: {
        type: Number,
        default: 0,
    },
    draws: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
const User = models.User || mongoose.model("User", userSchema);
export default User;
