import User from "../model/user.model.js";
import { UserNotFoundError } from "../error/user.error.js";
import mongoose from "mongoose";

class UserService {
  async getUserInfo(userId) {
    const _userId = new mongoose.Types.ObjectId(userId);
    const filter = {
      _id: _userId,
    };

    const userFounded = await User.findOne(filter).select('-password').exec();

    if (!userFounded) {
      throw new UserNotFoundError(`User with id: ${userId} not found!`);
    }

    return userFounded;
  }

  async updateUser(userId, userFields) {
    try {
      const updateFields = {};
      if (userFields.displayName) {
        updateFields.displayName = userFields.displayName;
      }
      if (userFields.avatar) {
        updateFields.avatar = userFields.avatar;
      }

      if (updateFields.hasOwnProperty("password")) {
        delete updateFields.password;
      }
      const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
        new: true,
        select: "-password",
      });

      if (!updatedUser) {
        throw new Error("User not found");
      }

      return updatedUser;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async findUserByPhoneNumber(phoneNumber) {
    try {
      const user = await User.findOne({ phoneNumber }).select('-password');
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }

}

const userService = new UserService();
export default userService;
