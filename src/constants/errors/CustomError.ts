import messages from './message';
import codeObj, { codeType } from './code';
export default class CustomError extends Error {
  constructor(code: codeType, ...params) {
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }
    this.code = codeObj[code] || 400;
    this.message = messages(code);
    if (params?.[0]?.message) {
      this.message = params[0].message;
    }
  }
  code: number;
}
