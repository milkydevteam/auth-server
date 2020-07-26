import * as mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    _id: Number,
    name: String,
    avatar: String, // luu file, sau do de duong dan vao day,
    address: String,
    phone: String,
    url: String,
    email: String,
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

const User = mongoose.model('User', userSchema);
export default User;
