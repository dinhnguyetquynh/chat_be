import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/user.model.js";
import {
  UserNotFoundError,
  PasswordNotMatchingError,
  RefreshTokenRevokedError,
  RefreshTokenNotFoundError,
} from "../error/user.error.js";
import { randomUUID } from "crypto";
import RefreshToken from "../model/refreshToken.model.js";
import mongoose from "mongoose";
import RevokedRefreshToken from "../model/revokedRefreshToken.model.js";

const expiredTime = Number(process.env.EXPIRED_TIME || 10000000000000 * 6);
class AuthServices {
  async signup(phoneNumber, password, displayName, avatar) {
    const existingUser = await User.findOne({ phoneNumber });

    if (existingUser) {
      throw new Error("Phone number has already been used");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      phoneNumber,
      password: hashedPassword,
      displayName,
      avatar,
    });
    await newUser.save();
    const accessTokenClaims = {
      sub: newUser._id.toString(),
      jti: randomUUID(),
      role: newUser.role,
      phoneNumber: newUser.phoneNumber,
    };

    const accessToken = jwt.sign(accessTokenClaims, process.env.JWT_SECRET, {
      expiresIn: expiredTime,
    });

    const refreshTokenClaims = {
      sub: newUser._id.toString(),
      jti: randomUUID(),
    };

    const refreshToken = jwt.sign(
      refreshTokenClaims,
      process.env.JWT_SECRET_REFRESH,
      {
        expiresIn: expiredTime * 1000,
      }
    );

    const newRefreshToken = new RefreshToken({
      userId: newUser._id,
      token: refreshToken,
    });
    await newRefreshToken.save();

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: expiredTime,
      user: newUser,
    };
  }

  async login(phoneNumber, password) {
    const filter = {
      phoneNumber,
    };

    const foundUser = await User.findOne(filter).exec();

    if (foundUser === null) {
      throw new UserNotFoundError(
        `User with phoneNumber: ${phoneNumber} not found!`
      );
    }

    const doesPasswordMatch = await bcrypt.compare(
      password,
      foundUser.password
    );

    if (!doesPasswordMatch) {
      throw new PasswordNotMatchingError(
        "Invalid credentials, please re-enter your credentials."
      );
    }

    const accessTokenClaims = {
      sub: foundUser._id.toString(),
      jti: randomUUID(),
      role: foundUser.role,
      phoneNumber: foundUser.phoneNumber,
    };

    const accessToken = jwt.sign(accessTokenClaims, process.env.JWT_SECRET, {
      expiresIn: expiredTime,
    });

    const refreshTokenClaims = {
      sub: foundUser._id.toString(),
      jti: randomUUID(),
    };

    const refreshToken = jwt.sign(
      refreshTokenClaims,
      process.env.JWT_SECRET_REFRESH,
      {
        expiresIn: expiredTime * 1000,
      }
    );

    // Persist the refresh token
    const foundRefreshToken = await RefreshToken.findOne({
      userId: foundUser._id,
    }).exec();

    if (foundRefreshToken === null) {
      const newRefreshToken = new RefreshToken({
        userId: foundUser._id,
        token: refreshToken,
      });

      await newRefreshToken.save();
    } else {
      const filter = {
        userId: foundUser._id,
      };

      const payload = {
        token: refreshToken,
      };

      await RefreshToken.updateOne(filter, payload).exec();
    }

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: expiredTime,
    };
  }

  async regenerateAccessToken(refreshToken) {
    const { payload: refreshTokenClaims } = jwt.decode(refreshToken, {
      complete: true,
    });

    const userId = new mongoose.Types.ObjectId(refreshTokenClaims.sub);

    /*
     * Check if refresh token is revoked or not
     * If revoked, return HTTP 401 Unauthorized.
     */
    const revokedRefreshedToken = await RevokedRefreshToken.findOne({
      userId,
    }).exec();

    if (revokedRefreshedToken) {
      throw new RefreshTokenRevokedError("Refresh token is already revoked!");
    }

    /*
     * Check if refresh token is present or not
     * If not present, return HTTP 401 Unauthorized.
     */
    const foundRefreshToken = await RefreshToken.findOne({
      userId,
    }).exec();

    if (foundRefreshToken === null) {
      throw new RefreshTokenNotFoundError("Invalid refresh token");
    }

    /*
     * Check if user is present or not
     * If not present, return HTTP 404 Not found.
     */
    const filter = {
      _id: userId,
    };

    const foundUser = await User.findOne(filter).exec();

    if (foundUser === null) {
      throw new UserNotFoundError(`User not found!`);
    }

    const accessTokenClaims = {
      sub: foundUser._id.toString(),
      jti: randomUUID(),
      role: foundUser.role,
      username: foundUser.username,
    };

    const accessToken = jwt.sign(accessTokenClaims, process.env.JWT_SECRET, {
      expiresIn: expiredTime,
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: expiredTime,
    };
  }

  async revokeRefreshToken(refreshToken) {
    const { payload: refreshTokenClaims } = jwt.decode(refreshToken, {
      complete: true,
    });

    const userId = new mongoose.Types.ObjectId(refreshTokenClaims.sub);

    // Persist the refresh token
    const foundRevokedRefreshToken = await RevokedRefreshToken.findOne({
      userId,
    }).exec();

    if (foundRevokedRefreshToken === null) {
      const newRefreshToken = new RevokedRefreshToken({
        userId,
        token: refreshToken,
      });

      await newRefreshToken.save();
    } else {
      foundRevokedRefreshToken.token = refreshToken;

      await foundRevokedRefreshToken.save();
    }
  }
}

const authServices = new AuthServices();

export default authServices;
