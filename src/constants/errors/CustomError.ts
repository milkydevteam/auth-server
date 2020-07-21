import messages from './message';

export default class CustomError extends Error {
  constructor(code, ...params) {
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }
    this.code = code;
    this.message = messages(code);
  }
  code: number;
}
