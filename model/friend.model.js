import mongoose from "mongoose";

const friendSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: Number,
    enum: [0, 1], 
    default: 0,
  },
});
const Friend = mongoose.model("Friend", friendSchema);

export default Friend;
