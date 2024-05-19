import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    text: {
      type: String,
    },
    files: {
      type: [String],
    },
    recallAt: {
      type: Date,
    },
    deleteAt: {
      type: Date,
    },
    createdAt: {
      type: Date,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    revoked: {
      type: Boolean,
      default: false, 
    }
  },
  { timestamps: true }
);
const Message = mongoose.model("Message", messageSchema);

export default Message;
