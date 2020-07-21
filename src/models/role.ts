const mongoose = require('mongoose');

// who is user? admin, user, ...

const roleSchema = new mongoose.Schema(
  {
    _id: Number,
    name: String,
    permissionIds: { type: [Number], default: [0] },
  },
  { versionKey: false },
);

const RoleModel = mongoose.model('Role', roleSchema);
export default RoleModel;
