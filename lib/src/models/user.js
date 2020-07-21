"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    _id: Number,
    name: String,
    avatar: String,
    link: [{ type: String, url: String }],
    address: String,
    phone: String,
    major: [String],
    jobType: [String],
    url: String,
}, {
    versionKey: false,
    timestamps: true,
});
const User = mongoose.model('User', userSchema);
exports.default = User;
//# sourceMappingURL=user.js.map