import messages from './message';
import codeObj, { codeType } from './code';
export default class CustomError extends Error {
  constructor(code: codeType, ...params) {
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }
    this.code = codeObj[code] || 500;
    this.message = messages(this.code);
  }
  code: number;
}
