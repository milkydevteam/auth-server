"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const language_1 = require("../constants/language");
const mongoose = require('mongoose');
const accountSchema = new mongoose.Schema({
    _id: Number,
    email: String,
    userName: String,
    password: String,
    salt: String,
    status: { type: String, default: 1 },
    active: { type: String, default: 1 },
    roles: [Number],
    language: { type: String, default: language_1.langKey.VI },
    lastRequestTime: Number,
}, {
    versionKey: false,
    timestamps: true,
});
const AccountModel = mongoose.model('Account', accountSchema);
exports.default = AccountModel;
//# sourceMappingURL=account.js.map