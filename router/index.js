import {Router} from "express";
import authRouter from "./auth.router.js";
import userRouter from "./user.router.js";
const rootRouter = Router();

rootRouter.use('/auth', authRouter);
rootRouter.use('/users', userRouter);

export default rootRouter;