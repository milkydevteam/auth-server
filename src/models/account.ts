import { langKey } from '../constants/language';
const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema(
  {
    _id: Number,
    email: String,
    userName: String,
    password: String,
    salt: String,
    status: { type: String, default: 1 }, // online: 1, offline: 0
    active: { type: String, default: 1 }, // active: 1, inactive: 0
    roles: [Number],
    language: { type: String, default: langKey.VI },
    lastRequestTime: Number,
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

const AccountModel = mongoose.model('Account', accountSchema);
export default AccountModel;
