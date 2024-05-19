import express from "express";
import friendController from "../controller/friend.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";



const router = express.Router();

router.post('/',authMiddleware, friendController.add);
router.put('/:friendId/accept',authMiddleware, friendController.accept);
router.delete('/:friendId', friendController.delete);
router.get('/list', authMiddleware,friendController.getFriendList);




export default router;