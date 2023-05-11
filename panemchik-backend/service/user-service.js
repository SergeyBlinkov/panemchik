const { User, TokenModel, Basket } = require("../models/models");
const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserDTO = require("../DataTransferObject/userDTO");
const TokenService = require("../service/token-service");

class UserService {
  //REGISTRATION
  async registration(email, password, role) {
    if (!email && !password) {
      throw ApiError.BadRequest("Некорректный email или password");
    }
    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
      throw ApiError.BadRequest("Пользователь с таким email уже существует");
    }
    let name = "Anonymous";
    const hashPassword = await bcrypt.hash(password, 5);
    const user = await User.create(
      {
        name,
        email,
        password: hashPassword,
        role,
        token: TokenModel,
        basket: Basket,
      },
      { include: [TokenModel, Basket] }
    );
    return TokenService.correctResponse(user);
  }
  //LOGIN
  async login(email, password) {
    if (!email || !password) {
      throw ApiError.BadRequest("Вы не ввели email или password");
    }
    const candidate = await User.findOne({
      where: { email },
    });

    if (!candidate) {
      throw ApiError.BadRequest("Пользователя с таким email не существует");
    }
    let comparePassword = bcrypt.compareSync(password, candidate.password);
    if (!comparePassword) {
      throw ApiError.BadRequest("Указан неверный пароль");
    }

    return await TokenService.correctResponse(candidate);
  }
}

module.exports = new UserService();
