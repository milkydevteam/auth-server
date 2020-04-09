const mongoose = require('mongoose');
const lang = require('../constants/language');

const accountSchema = new mongoose.Schema(
  {
    _id: Number,
    email: String,
    accName: String,
    password: String,
    salt: String,
    status: { type: String, default: 1 }, // online: 1, offline: 0
    active: { type: String, default: 1 }, // active: 1, inactive: 0
    roles: [Number],
    language: { type: String, default: lang.lang.VI },
    lastRequestTime: Number,
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

module.exports = mongoose.model('Account', accountSchema);
