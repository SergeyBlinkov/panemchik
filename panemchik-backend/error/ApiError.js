module.exports = class ApiError extends Error {
  status;
  errors;
  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
  static BadRequest(message, errors = []) {
    return new ApiError(404, message, errors);
  }
  static Unauthorized() {
    return new ApiError(401, "Пользователь не авторизован");
  }
  static Internal(message, errors) {
    return new ApiError(500, message, errors);
  }
  static Forbidden(message, errors) {
    return new ApiError(403, message, errors);
  }
};
