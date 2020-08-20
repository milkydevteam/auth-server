import CustomError from '../constants/errors/CustomError';
import UserModel from '../models/user';
import { UserType } from 'src/constants/type';
import oracleConnect from '../models';

export async function findAllUserById(userId: string) {
  const rs = await oracleConnect.excuteQuery(
    `select * from CMS_USER where USER_ID like '%${userId}%'`,
  );
  return rs;
}

async function createUser({
  userId,
  firstName,
  midName,
  lastName,
  address,
  email,
  branchId,
}) {
  return oracleConnect.excuteQuery(
    `insert into CMS_USER (USER_ID, FIRST_NAME, MIDDLE_NAME, LAST_NAME, ADDRESS, EMAIL, BRANCH_ID)
     values 
     ('${userId}', '${firstName}', '${midName}', '${lastName}', '${address}', '${email}', '${branchId}')`,
    false,
  );
}

async function updateUserInfo(userId, data) {
  const { name, address, phone } = data;
  const user: any = await UserModel.findById(userId);
  if (!user) throw new CustomError('USER_NOT_FOUND');
  user.address = address;
  user.phone = phone;
  user.name = name;
  await user.save();
}

async function getUserById(userId) {
  const userDoc = await UserModel.findById(userId);
  if (!userDoc) throw new CustomError('USER_NOT_FOUND');
  const user: UserType = userDoc.toJSON();
  return user;
}

async function findAll(condition, project) {
  try {
    const query = UserModel.find(condition, project);
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

export async function blockUser(userId: number, block: any) {
  // TODO
}

export { createUser, updateUserInfo, getUserById, findAll };
