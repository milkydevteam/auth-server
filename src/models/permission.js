const mongoose = require('mongoose');

//  user what allowed to do

const permissionSchema = new mongoose.Schema(
  {
    _id: Number,
    backendKey: {
      method: String,
      routePath: String,
    },
    frontendKey: String,
    position: { type: Number, default: 1000 },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model('Permission', permissionSchema);
