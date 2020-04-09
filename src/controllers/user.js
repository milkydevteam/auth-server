const userService = require('../services/user');
const { CustomError, code } = require('../constants/errors');

async function getUserById(req, res) {
  const { userId } = req.params;
  const user = await userService.getUserById({ _id: userId });
  return res.send({ status: 1, result: { user } });
}

async function getUsers(req, res) {
  try {
    const data = await userService.findAll({}, { name: 1, email: 1 });
    res.send({ result: { data }, status: 1 });
  } catch (error) {
    console.log('getUsers', error.message);
    res.send({ message: error.message, status: -1 });
  }
}

async function update(req, res) {
  if (!req.user) throw new CustomError(code.NOT_ACCESSED);
  const { userId: reqId } = req.user;
  const { userId } = req.params;
  if (userId !== reqId) throw new CustomError(code.NOT_ACCESSED);
  const rs = await userService.updateUserInfo(userId, req.body);
  return res.send(rs);
}

async function blockUser(req, res) {
  const { userId } = req.params;
  const { block } = req.body;
  await userService.blockUser(userId, block);
  return res.send({ status: 1 });
}

async function searchByEmail(req, res) {
  const { key, ...otherQuery } = req.query;
  if (otherQuery.groupIds) {
    otherQuery.groupIds = Number.parseInt(otherQuery.groupIds, 10);
  }
  const { data, error } = await userService.searchByEmail(key, otherQuery, {
    email: 1,
    name: 1,
    roles: 1,
  });
  if (data) {
    return res.send({ status: 1, result: data });
  }
  return res.send({ status: 0, message: error.message });
}

async function getUserByEmail(req, res) {
  const { email } = req.query;
  const user = await userService.findByEmail(email);
  console.log(user);
  return res.send({ status: 1, result: { user } });
}
module.exports = {
  getUserById,
  getUsers,
  blockUser,
  searchByEmail,
  update,
  getUserByEmail,
};
