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
exports.changePassword = exports.verifyAccessToken = exports.logout = exports.register = exports.login = void 0;
const authService = require("../services/auth");
const code_1 = require("../constants/errors/code");
const CustomError_1 = require("../constants/errors/CustomError");
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userName, password } = req.body;
            const accessToken = yield authService.login(userName, password);
            res.send({ status: 1, result: { accessToken } });
        }
        catch (error) {
            res.send({ status: 0, message: error.message });
        }
    });
}
exports.login = login;
exports.register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body) {
        throw new CustomError_1.default(code_1.default.REGISTER_INCLUDE);
    }
    const isExist = ['email', 'userName', 'password', 'name'].every(param => {
        return Object.keys(req.body).includes(param);
    });
    if (!isExist) {
        throw new CustomError_1.default(code_1.default.REGISTER_INCLUDE);
    }
    yield authService.register(req.body);
    res.send({ status: 1 });
});
function logout(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { accessToken } = req;
        yield authService.logout(accessToken);
        req.accessToken = null;
        req.user = null;
        req.userId = null;
        return res.send({ status: 1 });
    });
}
exports.logout = logout;
function verifyAccessToken(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { accessToken } = req;
        if (accessToken) {
            const { user } = yield authService.verifyAccessToken(accessToken);
            if (user) {
                return res.send({
                    status: 1,
                    result: {
                        user: {
                            name: user.name,
                            email: user.email,
                            id: user._id,
                            roles: user.roles,
                        },
                    },
                });
            }
        }
        return res.send({
            status: -1,
            message: 'Unauthorized',
        });
    });
}
exports.verifyAccessToken = verifyAccessToken;
function changePassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // const { password, newPassword, userId } = req.body;
        // await authService.changePassword(userId, password, newPassword);
        console.log(req.user);
        return res.send({ status: 1, user: req.user });
    });
}
exports.changePassword = changePassword;
//# sourceMappingURL=auth.js.map