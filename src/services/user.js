const CustomError = require('../constants/errors/CustomError');
const errorCodes = require('../constants/errors/code');
const User = require('../models/user');

async function createUser(_id, data) {
  const { name, address, phone, userName } = data;
  await User.create({
    _id,
    name,
    address,
    phone,
    url: userName,
  });
}

async function updateUserInfo(userId, data) {
  const { name, address, phone } = data;
  const user = await User.findById(userId);
  if (!user) throw new CustomError(errorCodes.USER_NOT_FOUND);
  user.address = address;
  user.phone = phone;
  user.name = name;
  await user.save();
}

async function getUserById(userId) {
  const user = await User.findById(userId);
  if (!user) throw new CustomError(errorCodes.USER_NOT_FOUND);
  return user.toJSON();
}

async function findAll(condition, project) {
  try {
    const query = User.find(condition, project);
    let data = [];
    if (project.limit && project.page) {
      const limitNumber = Number.parseInt(project.limit, 10);
      const pageNumber = Number.parseInt(project.page, 10);
      data = await query
        .skip(limitNumber * pageNumber)
        .limit(limitNumber)
        .exec();
    } else {
      data = await query.exec();
    }
    return data;
  } catch (error) {
    return error;
  }
}

module.exports = {
  createUser,
  updateUserInfo,
  getUserById,
  findAll,
};
