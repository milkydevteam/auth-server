"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const sessionSchema = new mongoose.Schema({
    accessToken: String,
    userId: String,
}, {
    timestamps: true,
    versionKey: false,
});
sessionSchema.index({ accessToken: -1, userId: -1 });
const Session = mongoose.model('Session', sessionSchema);
Session.createIndexes();
exports.default = Session;
//# sourceMappingURL=session.js.map