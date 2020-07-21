"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const snakecaseKeys = require("snakecase-keys");
const code_1 = require("../constants/errors/code");
const message_1 = require("../constants/errors/message");
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
    let statusCode = err.code;
    let { message } = err;
    const code = err.code || code_1.default.INTERNAL_SERVER_ERROR;
    switch (code) {
        case code_1.default.BAD_REQUEST:
            message = message || 'Bad Request';
            break;
        case code_1.default.UNAUTHORIZED:
            message = 'Unauthorized';
            break;
        case code_1.default.FORBIDDEN:
            message = 'Forbidden';
            break;
        case code_1.default.NOT_FOUND:
            message = 'Not Found';
            break;
        case code_1.default.TOO_MANY_REQUESTS:
            message = 'Too many requests';
            break;
        case code_1.default.INTERNAL_SERVER_ERROR:
            statusCode = code_1.default.INTERNAL_SERVER_ERROR;
            message = message || 'Something went wrong';
            break;
        default:
            message = message || message_1.default(code);
            statusCode = 200;
    }
    return res.status(statusCode).send(snakecaseKeys(code
        ? {
            status: 0,
            code,
            message,
        }
        : {
            status: 0,
            message,
        }));
}
exports.default = errorHandler;
//# sourceMappingURL=errorHandler.js.map