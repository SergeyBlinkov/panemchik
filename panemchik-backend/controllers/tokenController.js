const TokenService = require("../service/token-service");
const { User, Token, TokenModel, Basket } = require("../models/models");
const ApiError = require("../error/ApiError");
const UserDTO = require("../DataTransferObject/userDTO");
class TokenController {
  async access(req, res, next) {
    try {
      if (!req.headers?.authorization) {
        next(ApiError.Unauthorized());
      }

      const accessToken = req.headers?.authorization.split(" ")[1];
      if (!accessToken) {
        next(ApiError.Unauthorized());
      }

      const tokenData = await TokenService.validateAccessTokenService(
        accessToken
      );

      return res.json(new UserDTO(tokenData));
    } catch (e) {
      return next(e);
    }
  }
  async refresh(req, res, next) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        next(ApiError.Unauthorized());
      }
      const userData = await TokenService.refresh(refreshToken);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }
  async test(req, res, next) {
    try {
      return res.json("tipaWork");
    } catch (e) {
      throw new Error(e);
    }
  }
}

module.exports = new TokenController();
