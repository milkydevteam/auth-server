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
exports.registerWithSocial = exports.resetPassword = exports.changePassword = exports.verifyAccessToken = exports.logout = exports.login = exports.register = void 0;
const CustomError_1 = require("../constants/errors/CustomError");
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const code_1 = require("../constants/errors/code");
const user_1 = require("../models/user");
const account_1 = require("../models/account");
const UserService = require("./user");
const counter_1 = require("../models/counter");
// const Session = require('../models/session');
const { encrypt, decrypt } = require('../utils/security');
// const Redis = require('../utils/redis');
const type = require("../constants/type");
const { JWT_SECRET_KEY, JWT_EXPIRES_TIME } = process.env;
// async function createSession(userId, accessToken) {
//   await Redis.setAsync(accessToken, JSON.stringify({ userId }));
//   await Session.create({ userId, accessToken });
// }
// async function deleteSession(accessToken) {
//   await Redis.delAsync(accessToken);
//   await Session.deleteMany({ accessToken });
// }
function generateAccessToken(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const accessToken = jwt.sign(data, JWT_SECRET_KEY, {
            expiresIn: JWT_EXPIRES_TIME,
        });
        // createSession(data.userId, accessToken);
        return accessToken;
    });
}
function generateSalt() {
    return bcrypt.genSaltSync(10);
}
function hashSHA512(text) {
    return crypto
        .createHash('sha512')
        .update(text)
        .digest('hex');
}
function hashBcrypt(text, salt) {
    return __awaiter(this, void 0, void 0, function* () {
        const hashedBcrypt = new Promise((resolve, reject) => {
            bcrypt.hash(text, salt, (err, hash) => {
                if (err)
                    reject(err);
                resolve(hash);
            });
        });
        return hashedBcrypt;
    });
}
function compareBcrypt(data, hashed) {
    return __awaiter(this, void 0, void 0, function* () {
        const isCorrect = yield new Promise((resolve, reject) => {
            bcrypt.compare(data, hashed, (err, same) => {
                if (err)
                    reject(err);
                resolve(same);
            });
        });
        return isCorrect;
    });
}
function encryptPassword(password, salt) {
    return __awaiter(this, void 0, void 0, function* () {
        // Transform the plaintext password to hash value using SHA512
        const hashedSHA512 = hashSHA512(password);
        // Hash using bcrypt with a cost of 10 and unique, per-user salt
        const hashedBcrypt = yield hashBcrypt(hashedSHA512, salt);
        // Encrypt the resulting bcrypt hash with AES256
        const encryptAES256 = encrypt(hashedBcrypt);
        const encryptedPassword = encryptAES256;
        return encryptedPassword;
    });
}
function registerWithSocial(data) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(data);
        // TODO
    });
}
exports.registerWithSocial = registerWithSocial;
function register(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password, userName } = data;
        const isAccountExist = yield account_1.default.findOne({
            $or: [{ email }, { userName }],
        });
        if (isAccountExist) {
            throw new CustomError_1.default(code_1.default.USER_ALREADY_EXISTS);
        }
        console.log('1111');
        const salt = generateSalt();
        console.log('salt', salt);
        const _id = yield counter_1.default.incrementCount(type.increment.registerAccount);
        yield account_1.default.create({
            _id,
            userName,
            email,
            password: yield encryptPassword(password, salt),
            salt,
            type: type.accType.system,
        });
        yield UserService.createUser(_id, data);
    });
}
exports.register = register;
function login(userName, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const account = yield account_1.default.findOne({ userName });
        if (!account)
            throw new CustomError_1.default(code_1.default.ACCOUNT_NOT_FOUND);
        if (account.status === type.accStatus.inactive)
            throw new CustomError_1.default(code_1.default.BLOCK_USER);
        const { _id: userId } = account;
        const isCorrectPassword = yield compareBcrypt(hashSHA512(password), decrypt(account.password));
        if (!isCorrectPassword)
            throw new CustomError_1.default(code_1.default.ACCOUNT_NOT_FOUND);
        const user = yield UserService.getUserById(userId);
        const accessToken = yield generateAccessToken({ userId, name: user.name });
        return accessToken;
    });
}
exports.login = login;
function logout(accessToken) {
    return __awaiter(this, void 0, void 0, function* () {
        // await deleteSession(accessToken);
    });
}
exports.logout = logout;
function verifyAccessToken(token = '') {
    return __awaiter(this, void 0, void 0, function* () {
        const tokenSplit = token.split(' ');
        let accessToken = '';
        if (tokenSplit.length === 1) {
            [accessToken] = tokenSplit;
        }
        else {
            // eslint-disable-next-line
            accessToken = tokenSplit[1];
        }
        // const session = await Redis.getAsync(accessToken);
        // if (!session) {
        //   const sessionInDb = await Session.findOne({ accessToken });
        //   if (!sessionInDb) throw new CustomError(errorCodes.UNAUTHORIZED);
        // }
        const data = yield jwt.verify(accessToken, JWT_SECRET_KEY);
        const { userId } = data;
        const user = yield user_1.default.findById(userId);
        if (!user)
            throw new CustomError_1.default(code_1.default.UNAUTHORIZED);
        const userData = user.toJSON();
        if (userData.status === type.accStatus.inactive)
            throw new CustomError_1.default(code_1.default.BLOCK_USER);
        return { data, user: user.toJSON() };
    });
}
exports.verifyAccessToken = verifyAccessToken;
function changePassword(userId, password, newPassword, isManager = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield user_1.default.findById(userId);
        if (!user)
            throw new CustomError_1.default(code_1.default.USER_NOT_FOUND);
        const userData = user.toJSON();
        let { salt } = userData;
        const isCorrectPassword = yield compareBcrypt(hashSHA512(password), decrypt(userData.password));
        if (!isCorrectPassword && !isManager)
            throw new CustomError_1.default(code_1.default.DIFFERENT_PASSWORD);
        if (!salt) {
            salt = generateSalt();
        }
        yield user_1.default.findByIdAndUpdate(userId, {
            password: yield encryptPassword(newPassword, salt),
            salt,
        });
        return { status: 1 };
    });
}
exports.changePassword = changePassword;
function resetPassword(body, isManager = false) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!isManager)
            throw new CustomError_1.default(code_1.default.BAD_REQUEST);
        return changePassword(body.userId, '', body.newPassword, isManager);
    });
}
exports.resetPassword = resetPassword;
//# sourceMappingURL=auth.js.map