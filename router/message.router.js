import express from "express";
import {  storage } from '../s3.config.js'; 
import multer from "multer";
import messageController from "../controller/message.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";



const router = express.Router();
const upload = multer({ storage });

router.post("/",upload.array("files"), messageController.send);
router.put("/:messageId/revoked", authMiddleware, messageController.revoked);
router.get("/:conversationId", messageController.getAll);





export default router;