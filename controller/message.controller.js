import MessageService from "../service/message.service.js";
import { StatusCodes } from "http-status-codes";
class MessageController {
  async send(req, res) {
    try {
      const {
        conversationId,
        text,
        files,
        recallAt,
        deleteAt,
        senderId,
      } = req.body;
      const uploadedFilesUrls = req.files?.map((file) => file.location) ?? [];
      const savedMessage = await MessageService.sendMessage({
        conversationId,
        text,
        files: uploadedFilesUrls,
        recallAt,
        deleteAt,
        senderId,
      });

      return res
        .status(StatusCodes.OK)
        .json({ message: savedMessage, uploadedFiles: uploadedFilesUrls });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Error sending message", details: error.message });
    }
  }

  async revoked(req, res) {
    try {
      const { messageId } = req.params;
      const result = await MessageService.revokeMessage(messageId);
      return res.status(StatusCodes.OK).json(result);
    } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: "Error revoking message", details: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const { conversationId } = req.params;
      const { page = 1, limit = 5 } = req.query;

      const result = await MessageService.getAllMessages(conversationId, parseInt(page), parseInt(limit));
     return res.status(StatusCodes.OK).json( result );
    } catch (error) {
      console.error("Error retrieving messages:", error);
     return res.status(StatusCodes.NOT_FOUND).json({ error: "cant find Message" });
    }
  }
}


const messageController = new MessageController();
export default messageController;
