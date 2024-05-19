import authService from "../service/auth.service.js";
import { StatusCodes } from "http-status-codes";
class AuthController {
  async signup(req, res, next) {
    try {
        const {phoneNumber, password, displayName, avatar} = req.body;
        const newUser = await authService.signup(
          phoneNumber, password, displayName, avatar);
        res.status(StatusCodes.CREATED).json(newUser);
    } catch (err) {
        return next(err);
    }
}

  async login(req, res, next) {
    try {
      const { phoneNumber, password } = req.body;
      const loginResponse = await authService.login(phoneNumber, password);

      return res.status(StatusCodes.OK).json(loginResponse);
  } catch (err) {
      return next(err);
  }
}
async regenerateAccessToken(req, res, next) {
  try {
      const { token } = req.body;
      const regeneratedAccessTokenResponse = await authService.regenerateAccessToken(token);

      return res.status(StatusCodes.OK).json(regeneratedAccessTokenResponse);
  } catch (err) {
      return next(err);
  }
}

async revokeRefreshToken(req, res, next) {
  try {
      const { token } = req.body;

      await authService.revokeRefreshToken(token);

      res.status(StatusCodes.NO_CONTENT);

      return res.end();
  } catch (err) {
      return next(err);
  }
}
}
const authController = new AuthController();
export default authController;
