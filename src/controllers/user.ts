import * as userService from '../services/user';
import * as authController from './auth';
import CustomError from '../constants/errors/CustomError';
import oracleConnect from '../models';
import UserModel from '../models/UserModel';
import { checkUserField } from '../utils/check';


export async function createUser(req, res) {
  checkUserField(req.body, 'create');

  const {
    firstName,
    middleName,
    lastName,
    address,
    email,
    branchId,
  } = req.body;
  const mergeName = `${firstName.trim()} ${middleName.trim()}`;
  const split = mergeName.split(' ');
  let userId = lastName;
  split.forEach(i => (userId += i[0].toLocaleLowerCase()));

  try {
    const countUserId = await new UserModel({}).find(
      `USER_ID LIKE '%${userId}%'`,
      ['*'],
    );
    if (countUserId.length !== 0) {
      userId += countUserId.length - 1;
    }
    await new UserModel(
      {
        userId,
        firstName,
        middleName,
        lastName,
        address,
        email,
        branchId,
      },
    ).save();

  } catch (error) {
    console.log('create user', error);
    throw new CustomError('INTERNAL_SERVER_ERROR');
  }
  res.send({ status: 1, result: { data: userId } });
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
