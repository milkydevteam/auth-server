"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const async_1 = require("./async");
const authService = require("../services/auth");
const CustomError = require('../constants/errors/CustomError');
const codes = require('../constants/errors/code');
function auth(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { authorization } = req.headers;
        if (!authorization)
            throw new CustomError(codes.UNAUTHORIZED);
        const [tokenType, accessToken] = authorization.split(' ');
        if (tokenType !== 'Bearer')
            throw new Error();
        const { user } = yield authService.verifyAccessToken(accessToken);
        if (user) {
            req.user = {
                userId: user._id,
                roles: user.roles,
            };
        }
        if (['/auths/logout', '/auths/verify'].includes(req.path)) {
            req.accessToken = accessToken;
        }
        return next();
    });
}
const asyncAuth = async_1.default(auth);
exports.default = asyncAuth;
//# sourceMappingURL=auth.js.map