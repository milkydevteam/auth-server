import CustomError from '../constants/errors/CustomError';
import UserModel from '../models/UserModel';
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

export async function createUserOnlyEmail(email) {
  return await new UserModel({email}).save();
}

async function updateUserInfo(userId: number, data: {firstName?: string, middleName?:string, lastName?: string, address?: string}) {
  return new UserModel(data).updateBasicInfor(userId)
}

async function getUserById(userId) {
  return await new UserModel({userId}).findById();
}

async function findAll(condition, project) {
  // TODO
}

export async function blockUser(userId: number, block: any) {
  // TODO
}

export { createUser, updateUserInfo, getUserById, findAll };
