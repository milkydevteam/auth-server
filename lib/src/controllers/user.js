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
exports.blockUser = exports.update = exports.getUsers = exports.getUserById = exports.getOwnerProfile = void 0;
const userService = require("../services/user");
const code_1 = require("../constants/errors/code");
const CustomError_1 = require("../constants/errors/CustomError");
function getOwnerProfile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (req.user) {
                const { userId } = req.user;
                const user = yield userService.getUserById(userId);
                return res.send({ status: 1, result: { user } });
            }
            return res.send({
                status: 0,
                message: 'Unauthorized',
            });
        }
        catch (error) {
            return res.send({
                status: 0,
                message: error.message,
            });
        }
    });
}
exports.getOwnerProfile = getOwnerProfile;
function getUserById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = req.params;
        const user = yield userService.getUserById({ _id: userId });
        return res.send({ status: 1, result: { user } });
    });
}
exports.getUserById = getUserById;
function getUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield userService.findAll({}, { name: 1, email: 1 });
            res.send({ result: { data }, status: 1 });
        }
        catch (error) {
            res.send({ message: error.message, status: -1 });
        }
    });
}
exports.getUsers = getUsers;
function update(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.user)
            throw new CustomError_1.default(code_1.default.NOT_ACCESSED);
        const { userId: reqId } = req.user;
        const { userId } = req.params;
        if (userId !== reqId)
            throw new CustomError_1.default(code_1.default.NOT_ACCESSED);
        const rs = yield userService.updateUserInfo(userId, req.body);
        return res.send(rs);
    });
}
exports.update = update;
function blockUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = req.params;
        const { block } = req.body;
        yield userService.blockUser(userId, block);
        return res.send({ status: 1 });
    });
}
exports.blockUser = blockUser;
//# sourceMappingURL=user.js.map