"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const code_1 = require("./code");
const language_1 = require("../language");
function getErrorMessage(code) {
    switch (code) {
        case code_1.default.USER_ALREADY_EXISTS:
            return language_1.t('USER_ALREADY_EXISTS');
        case code_1.default.NOT_ACCESSED:
            return language_1.t('NOT_ACCESSED');
        case code_1.default.NOT_FOUND_EMAIL:
            return language_1.t('NOT_FOUND_EMAIL');
        case code_1.default.DIFFERENT_PASSWORD:
            return language_1.t('DIFFERENT_PASSWORD');
        case code_1.default.USER_NOT_FOUND:
            return language_1.t('USER_NOT_FOUND');
        case code_1.default.BLOCK_USER:
            return language_1.t('BLOCK_USER');
        case code_1.default.ACCOUNT_NOT_FOUND:
            return language_1.t('ACCOUNT_NOT_FOUND');
        case code_1.default.REGISTER_INCLUDE:
            return language_1.t('REGISTER_INCLUDE');
        default:
            return null;
    }
}
exports.default = getErrorMessage;
//# sourceMappingURL=message.js.map