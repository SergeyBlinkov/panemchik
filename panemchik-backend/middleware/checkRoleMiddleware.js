const jwt = require("jsonwebtoken");
const ApiError = require("../error/ApiError");

module.exports = (role) => (req, res, next) => {
  if (req.method === "OPTIONS") {
    next();
  }
  try {
    if (!req.headers?.authorization) {
      next(ApiError.Unauthorized());
    }
    const token = req.headers.authorization.split(" ")[1]; //Bearer {token}
    if (!token) {
      return ApiError.Unauthorized();
    }
    const decoded = jwt.verify(token, process.env.TOKEN_ACCESS_SECRET_KEY, {
      algorithm: ["HS256"],
    });
    if (decoded.role !== role) {
      return next(ApiError.Unauthorized());
    }
    req.user = decoded;
    next();
  } catch (e) {
    next(e);
  }
};
