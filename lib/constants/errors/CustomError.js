"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const message_1 = require("./message");
class CustomError extends Error {
    constructor(code, ...params) {
        super(...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CustomError);
        }
        this.code = code;
        this.message = message_1.default(code);
    }
}
exports.default = CustomError;
//# sourceMappingURL=CustomError.js.map