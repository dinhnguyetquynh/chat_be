import ConversationService from "../service/conversation.service.js";
import { StatusCodes } from "http-status-codes";
class ConversationController {
  async create(req, res) {
    try {
      const { userIds } = req.body;
      const conversation = await ConversationService.createConversation({
        members: userIds,
      });
      return res.status(StatusCodes.CREATED).json(conversation);
    } catch (error) {
      return res.status(StatusCodes.FORBIDDEN).json({ error: error.message });
    }
  }

  async getByToken(req, res) {
    try {
      const conversation = await ConversationService.getConversationByToken(
        req.userId
      );
      return res.status(StatusCodes.OK).json(conversation);
    } catch (error) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "cant not find" });
    }
  }
  async add(req, res) {
    try {
      const { conversationId } = req.params;
      const { memberId } = req.body;
      const conversation = await ConversationService.addMembers(
        conversationId,
        memberId
      );

      return res.status(StatusCodes.OK).json(conversation);
    } catch (error) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Error adding member to conversation" });
    }
  }
  async delete(req, res) {
    try {
      const { conversationId, memberIds } = req.body;
      const conversation = await ConversationService.deleteMembers(
        conversationId,
        memberIds
      );
      return res.status(StatusCodes.OK).json(conversation);
    } catch (error) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Error deleting member from conversation" });
    }
  }
  async findFilesInConversation(req, res) {
    try {
      const { conversationId } = req.params;
      const files = await ConversationService.findFilesInConversation(
        conversationId
      );
      res.status(StatusCodes.OK).json(files);
    } catch (error) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Error finding files in conversation" });
    }
  }
  async getConversationByUserId(req, res) {
    try {
      const { userId } = req.params;
      const conversation = await ConversationService.getConversationByUserId(
        userId
      );
      res.status(StatusCodes.OK).json(conversation);
    } catch (error) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Error finding conversation by user id" });
    }
  }
  async update(req, res) {
    try {
      const { conversationId } = req.params;
      const { name, avatar } = req.body;
      const uploadedFilesUrls = req.file?.location;
      const updateConversation = await ConversationService.updateConversation(
        conversationId,
        {
          name,
          avatar: uploadedFilesUrls,
        }
      );
      res.status(StatusCodes.OK).json(updateConversation);
    } catch (error) {
      return res.status(StatusCodes.FORBIDDEN).json({ error: "cant update" });
    }
  }
  async getConversationById(req, res) {
    try {
      const { conversationId } = req.params;
      const conversation = await ConversationService.getConversationById(
        conversationId
      );

      return res.status(StatusCodes.OK).json(conversation);
    } catch (error) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Error finding conversation by id" });
    }
  }
}
const conversationController = new ConversationController();
export default conversationController;
