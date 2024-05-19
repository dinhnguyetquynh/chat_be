import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            default: null,
        },
        message: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
            default:null,
        },
        avatar: {
            type: String,
            default: null,
        },
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        members: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }],
        lastMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        }

    },
    {timestamps: true}
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
