const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
  {
    accessToken: String,
    userId: String,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

sessionSchema.index({ accessToken: -1, userId: -1 });

const Session = mongoose.model('Session', sessionSchema);
Session.createIndexes();

module.exports = Session;
