import express from 'express'; 
import connectToMongoDB from "./db/connectToMongoDB.js";
import dotenv from 'dotenv'; 
import authRouter from './router/auth.router.js';
import conversationRouter from './router/conversation.router.js';
import messageRouter from './router/message.router.js';
import friendRouter from './router/friend.router.js';
import userRouter from './router/user.router.js';
import cors from 'cors'
import { RouteNotFoundErrorMiddleware, UnhandleErrorMiddleware } from './middlewares/index.js';
import { app, server } from "./socket/socket.js";
const PORT = process.env.PORT || 3000;



dotenv.config();
await connectToMongoDB();

app.use(express.json());
app.use(cors());
app.use("/api/messages",messageRouter),
app.use("/api/conversations", conversationRouter),
app.use("/api/auth", authRouter),
app.use("/api/friends", friendRouter),
app.use("/api/users",userRouter),

app.use(UnhandleErrorMiddleware);
app.use(RouteNotFoundErrorMiddleware);


 server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});