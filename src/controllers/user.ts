import * as userService from '../services/user';
import CustomError from '../constants/errors/CustomError';

export async function getOwnerProfile(req, res) {
  try {
    if (req.user) {
      const { userId } = req.user;
      const user = await userService.getUserById(userId);
      return res.send({ status: 1, result: { user } });
    }
    return res.send({
      status: 0,
      message: 'Unauthorized',
    });
  } catch (error) {
    return res.send({
      status: 0,
      message: error.message,
    });
  }
}

export async function getUserById(req, res) {
  const { userId } = req.params;
  const user = await userService.getUserById({ _id: userId });
  return res.send({ status: 1, result: { user } });
}

export async function getUsers(req, res) {
  try {
    const data = await userService.findAll({}, { name: 1, email: 1 });
    res.send({ result: { data }, status: 1 });
  } catch (error) {
    res.send({ message: error.message, status: -1 });
  }
}

export async function update(req, res) {
  if (!req.user) throw new CustomError('NOT_ACCESSED');
  const { userId: reqId } = req.user;
  const { userId } = req.params;
  if (userId !== reqId) throw new CustomError('NOT_ACCESSED');
  const rs = await userService.updateUserInfo(userId, req.body);
  return res.send(rs);
}

export async function blockUser(req, res) {
  const { userId } = req.params;
  const { block } = req.body;
  await userService.blockUser(userId, block);
  return res.send({ status: 1 });
}
