import express from "express";
import ConversationController from "../controller/conversation.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import {  storage } from '../s3.config.js'; 
import multer from "multer";


const upload = multer({ storage });
const router = express.Router();

router.post("/", authMiddleware,ConversationController.create);
router.get("/",authMiddleware, ConversationController.getByToken);
router.put("/:conversationId/members",authMiddleware, ConversationController.add);
router.delete("/",authMiddleware, ConversationController.delete);
router.get("/:conversationId/files", ConversationController.findFilesInConversation);
router.get("/:userId/user", ConversationController.getConversationByUserId);
router.put("/:conversationId",upload.single('avatar'), ConversationController.update);
router.get("/:conversationId", ConversationController.getConversationById);

export default router;
