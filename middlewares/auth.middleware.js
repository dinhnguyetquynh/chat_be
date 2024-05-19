import {
  NoTokenProvidedError,
  TokenExpiredError,
} from "../error/user.error.js";
import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      throw new NoTokenProvidedError("No token provided");
    }
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new NoTokenProvidedError("No token provided");
    }

    const claims = jwt.verify(token, process.env.JWT_SECRET);
    const { sub } = claims;
    req.userId = sub;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new TokenExpiredError("Token expired");
    }
    throw new NoTokenProvidedError("Token invalid");
  }
};

export default authMiddleware;
