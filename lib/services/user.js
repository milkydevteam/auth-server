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
exports.findAll = exports.getUserById = exports.updateUserInfo = exports.createUser = exports.blockUser = void 0;
const CustomError_1 = require("../constants/errors/CustomError");
const code_1 = require("../constants/errors/code");
const user_1 = require("../models/user");
function createUser(_id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, address, phone, userName } = data;
        yield user_1.default.create({
            _id,
            name,
            address,
            phone,
            url: userName,
        });
    });
}
exports.createUser = createUser;
function updateUserInfo(userId, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, address, phone } = data;
        const user = yield user_1.default.findById(userId);
        if (!user)
            throw new CustomError_1.default(code_1.default.USER_NOT_FOUND);
        user.address = address;
        user.phone = phone;
        user.name = name;
        yield user.save();
    });
}
exports.updateUserInfo = updateUserInfo;
function getUserById(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield user_1.default.findById(userId);
        if (!user)
            throw new CustomError_1.default(code_1.default.USER_NOT_FOUND);
        return user.toJSON();
    });
}
exports.getUserById = getUserById;
function findAll(condition, project) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = user_1.default.find(condition, project);
            let data = [];
            if (project.limit && project.page) {
                const limitNumber = Number.parseInt(project.limit, 10);
                const pageNumber = Number.parseInt(project.page, 10);
                data = yield query
                    .skip(limitNumber * pageNumber)
                    .limit(limitNumber)
                    .exec();
            }
            else {
                data = yield query.exec();
            }
            return data;
        }
        catch (error) {
            return error;
        }
    });
}
exports.findAll = findAll;
function blockUser(userId, block) {
    return __awaiter(this, void 0, void 0, function* () {
        // TODO
    });
}
exports.blockUser = blockUser;
//# sourceMappingURL=user.js.map