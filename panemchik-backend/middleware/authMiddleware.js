const jwt = require("jsonwebtoken");
const ApiError = require("../error/ApiError");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1]; //Bearer {token}
    if (!token) {
      return next(ApiError.Unauthorized());
    }
    const decoded = jwt.verify(token, process.env.TOKEN_ACCESS_SECRET_KEY);
    if (!decoded) {
      return next(ApiError.Unauthorized());
    }
    req.user = decoded;
    next();
  } catch (e) {
    return next(ApiError.Unauthorized());
  }
};
