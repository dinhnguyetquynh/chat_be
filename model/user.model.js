import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        friends: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }],
        phoneNumber: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            require: true,
          
        },
        displayName: {
            type: String,
            default: null
        },
        avatar: {
            type: String,
            default: null
        },
       
    },
    {timestamps: true}
);
const User = mongoose.model("User", userSchema);

export default User;
