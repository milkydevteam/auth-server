import * as userService from '../services/user';
import * as accountService from '../services/auth';
import CustomError from '../constants/errors/CustomError';

const checkField = (data, type: 'create') => {
  let exist;
  if (type === 'create') {
    exist = [
      'userId',
      'firstName',
      'midName',
      'lastName',
      'address',
      'email',
      'branchId',
    ].every(param => {
      return Object.keys(data).includes(param);
    });
  }
  if (!exist) throw new CustomError('NOT_FULL_INFO');
};

export async function createAccount(req, res) {
  checkField(req.body, 'create');

  const {
    firstName,
    midName,
    lastName,
    address,
    email,
    branchId,
    password,
  } = req.body;
  const mergeName = `${firstName} ${midName}`;
  const split = mergeName.split(' ');
  let userId = lastName;
  split.forEach(i => (userId += i[0].toLocaleLowerCase()));
  const countUserId = await userService.findAllUserById(userId);
  if (countUserId.length !== 0) {
    userId += countUserId.length - 1;
  }
  await userService.createUser({
    userId,
    firstName,
    midName,
    lastName,
    address,
    email,
    branchId,
  });
  res.send({ status: 1 });
}

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
