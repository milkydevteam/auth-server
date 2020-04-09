const messages = require('./message');

class CustomError extends Error {
  constructor(code, ...params) {
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }
    this.code = code;
    this.message = messages(code);
  }
}

module.exports = CustomError;
