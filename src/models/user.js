const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    _id: Number,
    name: String,
    avatar: String, // luu file, sau do de duong dan vao day,
    link: [{ type: String, url: String }],
    address: String,
    phone: String,
    major: [String],
    jobType: [String], // freelance, fulltime, parttime, remote
    url: String,
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

module.exports = mongoose.model('User', userSchema);
