import {Router} from "express";
import {ValidateData} from "../middlewares/index.js";
import {userSignupSchema, userLoginSchema, tokenSchema} from "../schemas/auth.schema.js";
import authController from "../controller/auth.controller.js";

const router = Router();

router.post('/signup', ValidateData(userSignupSchema), authController.signup);
router.post('/login', ValidateData(userLoginSchema), authController.login);
router.post('/token', ValidateData(tokenSchema), authController.regenerateAccessToken);
router.post('/revoke', ValidateData(tokenSchema), authController.revokeRefreshToken);
export default router;