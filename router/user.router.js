import {Router} from "express";
import userController from "../controller/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import {  storage } from '../s3.config.js'; 
import multer from "multer";

const router = Router();
const upload = multer({ storage });
router.get('/', authMiddleware, userController.getUserInfo);
router.put('/', upload.single("avatar"), authMiddleware, userController.update);
router.get('/:phoneNumber/phone', userController.findUserByPhoneNumber );

export default router;