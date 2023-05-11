const jwt = require("jsonwebtoken");
const { User, TokenModel, TestToken } = require("../models/models");
const ApiError = require("../error/ApiError");
const { where } = require("sequelize");
const UserDTO = require("../DataTransferObject/userDTO");

class TokenService {
  //################################
  async correctResponse(candidate) {
    try {
      const userDto = new UserDTO(candidate);
      const tokens = this.generateToken({ ...userDto });
      console.log(userDto);
      await this.saveToken(userDto.id, tokens.refreshToken);
      return { ...tokens, user: userDto };
    } catch (e) {
      return ApiError.BadRequest("unpredictable error");
    }
  }
  //################################
  generateToken(payload) {
    const accessToken = jwt.sign(payload, process.env.TOKEN_ACCESS_SECRET_KEY, {
      expiresIn: "30m",
    });
    console.log("34");
    const refreshToken = jwt.sign(
      payload,
      process.env.TOKEN_REFRESH_SECRET_KEY,
      {
        expiresIn: "30d",
      }
    );
    if (!accessToken || !refreshToken) {
      return ApiError.Forbidden("Token cannot generate,unpredictable error");
    }
    return { accessToken, refreshToken };
  }
  //################################
  // async (userId, refreshToken) {
  //   const tokenData = await "tokenModel".findOne({user:userId,refreshToken})
  //   if(tokenData) {
  //     tokenData.refreshToken = refreshToken
  //     return tokenData.save()
  //   }
  //   const token = await "tokenModel".create({user:userId,refreshToken})
  //   return token
  // }
  //################################
  async validateAccessTokenService(accessToken) {
    console.log(accessToken);
    try {
      if (!accessToken) {
        ApiError.Unauthorized();
        return;
      }
      const dataVerify = await jwt.verify(
        accessToken,
        process.env.TOKEN_ACCESS_SECRET_KEY,
        { algorithms: "HS256" },
        (err, token) => {
          if (err) {
            throw err;
          } else return token;
        }
      );
      return dataVerify;
    } catch (err) {
      throw ApiError.Unauthorized();
    }
  }

  //################################
  async validateRefreshTokenService(refreshToken) {
    try {
      const userData = await jwt.verify(
        refreshToken,
        process.env.TOKEN_REFRESH_SECRET_KEY,
        { algorithms: ["HS256"] },
        (err, token) => {
          if (err) {
            throw err;
          } else return token;
        }
      );
      const tokenFromDB = await TokenModel.findOne({ where: { refreshToken } });
      if (!tokenFromDB || !userData) {
        ApiError.Unauthorized();
        return;
      }
      return userData;
    } catch (e) {
      return ApiError.Unauthorized();
    }
  }
  //################################

  async refresh(refreshToken) {
    if (!refreshToken) {
      return ApiError.Unauthorized();
    }
    const validateToken = await this.validateRefreshTokenService(refreshToken);
    if (!validateToken) {
      return ApiError.Unauthorized();
    }
    return this.correctResponse(validateToken);
  }
  //################################
  async saveToken(userId, refreshToken) {
    try {
      const tokenData = await TokenModel.findOne({ where: { userId } });
      if (!tokenData) {
        return await TokenModel.create(userId, refreshToken);
      }
      return await TokenModel.update({ refreshToken }, { where: { userId } });
    } catch (e) {
      return ApiError.BadRequest("cannot save token");
    }
  }
  //################################
  async removeToken(refreshToken) {
    // const tokenData = await Token.delete({ refreshToken });
  }
}

module.exports = new TokenService();
