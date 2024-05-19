import Conversation from "../model/conversation.model.js";
import User from "../model/user.model.js";
import mongoose from "mongoose";
import Message from "../model/message.model.js";

class ConversationService {
  async getConversationByToken(userId) {
    try {
      const arrayCondition = [userId];
      const conversations = await Conversation.find({
        members: { $in: arrayCondition },
      })
        .populate("message")
        .populate({
          path: "members",
          select: "-password",
        });

      return conversations;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createConversation(conversation) {
    try {
      const invalidUserIds = await this.checkValidateUserIds(
        conversation.members
      );
      const allUserIdsValid = invalidUserIds.every((userId) => !userId);
      if (!allUserIdsValid) {
        throw new Error("One or more user IDs are invalid");
      }
      if (conversation.members.length >= 3) {
        conversation.avatar = "https://images.app.goo.gl/5wZY7jA73QDhXryd7";
      }
      conversation.admin = conversation.members[0];
      const creator = await User.findById(conversation.admin);
      if (!creator) {
        throw new Error("Creator not found");
      }
      conversation.name = `Được Tạo Bởi ${creator.displayName}`;

      const newConversation = await Conversation.create(conversation);
      return newConversation;
    } catch (error) {
      throw new Error(`Failed to create conversation: ${error.message}`);
    }
  }

  async checkValidateUserIds(userIds) {
    try {
      const invalidUserIds = [];
      for (const userId of userIds) {
        if (typeof userId !== "string") {
          throw new Error("userId must be a string");
        }

        const user = await User.findById(userId);
        if (!user) {
          invalidUserIds.push(userId);
        }
      }
      const hasInvalidUserId = invalidUserIds.some((userId) => !!userId);
      if (hasInvalidUserId) {
        throw new Error("One or more user IDs are invalid");
      }
      return invalidUserIds;
    } catch (error) {
      throw new Error(`UserId not in database: ${error.message}`);
    }
  }

  async addMembers(conversationId, memberId) {
    try {
      if (!Array.isArray(memberId)) {
        throw new Error("memberId should be an array");
      }

      const objectIdMembers = memberId.map((id) => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new Error(`Invalid ObjectId: ${id}`);
        }
        return new mongoose.Types.ObjectId(id);
      });

      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        throw new Error("Conversation not found");
      }

      conversation.members.push(...objectIdMembers);

      conversation.members = [
        ...new Set(conversation.members.map((member) => member.toString())),
      ].map((id) => new mongoose.Types.ObjectId(id));

      if (conversation.members.length > 3) {
        conversation.avatar = "https://images.app.goo.gl/5wZY7jA73QDhXryd7";
      }
      conversation.admin = conversation.members[0];
      const creator = await User.findById(conversation.admin);
      if (!creator) {
        throw new Error("Creator not found");
      }
      conversation.name = `Được Tạo Bởi ${creator.displayName}`;

      await conversation.save();

      return conversation;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteMembers(conversationId, memberIds) {
    try {
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        throw new Error("Conversation not found");
      }
      memberIds.forEach((memberId) => {
        const index = conversation.members.indexOf(memberId);
        if (index !== -1) {
          conversation.members.splice(index, 1);
        }
      });
      await conversation.save();
      return conversation;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findFilesInConversation(conversationId) {
    try {
      const messages = await Message.find({ conversationId });
      const files = messages.reduce((acc, message) => {
        if (message.files && message.files.length > 0) {
          acc.push(...message.files);
        }

        return acc;
      }, []);
      return files;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getConversationByUserId(userId) {
    try {
      const conversation = await Conversation.find({
        members: { $in: [userId] },
      })
        .populate("message")
        .populate({
          path: "members",
          select: "-password",
        });
      if (!conversation) {
        throw new Error("Conversation not found");
      }

      return conversation;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async updateConversation(conversationId, conversationFields) {
    try {
      const updateFields = {};
      if (conversationFields.name) {
        updateFields.name = conversationFields.name;
      }
      if (conversationFields.avatar) {
        updateFields.avatar = conversationFields.avatar;
      }
      const updatedConversation = await Conversation.findByIdAndUpdate(
        conversationId,
        updateFields,
        {
          new: true,
        }
      )
        .populate("message")
        .populate({
          path: "members",
          select: "-password",
        });
      if (!updatedConversation) {
        throw new Error("conversation not found");
      }

      return updatedConversation;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getConversationById(conversationId) {
    try {
      const conversation = await Conversation.findById(conversationId)
        .populate({
          path: "members",
          select: "-password",
        })
        .populate("message");
      if (!conversation) {
        throw new Error("Conversation not found");
      }

      return conversation;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
const conversationService = new ConversationService();
export default conversationService;
