import Message from "../model/message.model.js";
import User from "../model/user.model.js";
import Conversation from "../model/conversation.model.js";

class MessageService {
  async sendMessage(messageData) {
    try {
      const { conversationId, text, files, recallAt, deleteAt, senderId } =
        messageData;

      const newMessage = new Message({
        conversationId,
        text,
        files,
        recallAt,
        deleteAt,
        senderId,
      });

      const savedMessage = await newMessage.save();
      const conversation = await Conversation.findOneAndUpdate(
        { _id: conversationId },
        { $set: { message: savedMessage._id } },
        { new: true }
      );
      if (!conversation) {
        throw new Error("Conversation not found");
      }
      const sender = await User.findById(senderId);
      if (!sender) {
        throw new Error("Sender not found");
      }

      const messageWithSenderInfo = {
        ...savedMessage.toObject(),
        sender: {
          id: sender._id,
          friend: sender.friend,
          phoneNumber: sender.phoneNumber,
          displayName: sender.displayName,
          avatar: sender.avatar,
        },
      };

      return messageWithSenderInfo;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async revokeMessage(messageId) {
    try {
      const message = await Message.findByIdAndUpdate(
        messageId,
        { revoked: true },
        { new: true }
      );
      if (!message) {
        throw new Error("Message not found");
      }
      return { success: true, message: "Message revoked successfully" };
    } catch (error) {
      throw new Error(error.message);
    }
  }



  async  getAllMessages(conversationId) {
    try {
        // Lấy tất cả tin nhắn, sắp xếp theo thứ tự giảm dần của createdAt
        const allMessages = await Message.find({ conversationId })
            .sort({ createdAt: -1 })
            .populate('senderId', 'phoneNumber displayName avatar');

  
        const latestMessages = allMessages.slice(0, 20);

        return {
            messages: latestMessages
        };
    } catch (error) {
        throw new Error(error.message);
    }
}

  
}

const messageService = new MessageService();
export default messageService;
