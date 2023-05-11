const ApiError = require("../error/ApiError");
const {
  User,
  Product,
  ProductPrice,
  TestToken,
  TokenModel,
  Basket,
} = require("../models/models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const checkRole = require("../middleware/checkRoleMiddleware");
const TokenService = require("../service/token-service");
const UserDTO = require("../DataTransferObject/UserDTO");
const UserService = require("../service/user-service");
// const generateJwt = (id, email, role) => {
//   const currRole = role ? role.toUpperCase() : "USER";
//   const accessToken = jwt.sign(
//     { id, email, currRole },
//     process.env.TOKEN_ACCESS_SECRET_KEY,
//     { expiresIn: "24h" }
//   );
//   const refreshToken = jwt.sign(
//     { id, email, currRole },
//     process.env.TOKEN_REFRESH_SECRET_KEY,
//     { expiresIn: "30d" }
//   );
//   return {
//     accessToken,
//     refreshToken,
//   };
// };

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJlbWFpbDEyQGdtYWlsLmNvbSIsImlkIjozOSwibmFtZSI6IkFub255bW91cyIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNjc3OTUxODE0LCJleHAiOjE2ODA1NDM4MTR9.Ssj5ra3kifdIzmtqyVD-I3t9rirl02Rne2f_ZVAMUMw
//
class UserController {
  async getUsers(req, res, next) {
    try {
      const user = await User.findAll();
      const token = await TokenModel.findAll();
      return res.json({ token, user });
      // const products = await Product.findAll({
      //   include: [{ model: ProductPrice, as: "price" }],
      // });
    } catch (e) {
      throw new Error(e);
    }
  }

  async registration(req, res, next) {
    const generateRole = (role) => {
      try {
        if (!req?.headers.authorization) {
          return "USER";
        }
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.TOKEN_ACCESS_SECRET_KEY, {
          algorithm: ["HS256"],
        });
        if (!token) return "USER";
        else if (decoded.role !== "ADMIN") return "USER";
        else return role;
      } catch (e) {
        return "USER";
      }
    };
    try {
      const { email, password, role } = req.body;
      if (email.length === 0 && password.length === 0) {
        next(ApiError.BadRequest("Введите корректно логин или пароль"));
      }
      const isAdmin = generateRole(role);
      const credentials = await UserService.registration(
        email,
        password,
        isAdmin
      );
      res.cookie("refreshToken", credentials.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(credentials);
    } catch (e) {
      next(e);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const credentials = await UserService.login(email, password);
      if (!credentials) {
        next(ApiError.BadRequest());
      }
      res.cookie("refreshToken", credentials.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(credentials);
    } catch (e) {
      next(e);
    }
  }
  async check(req, res) {
    const token = TokenService.generateToken(req.user.id, req.user.email);
    return res.json(token);
  }
}

module.exports = new UserController();
