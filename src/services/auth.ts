import CustomError from '../constants/errors/CustomError';
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

import User from '../models/user';
import Account from '../models/account';
import Counter from '../models/counter';
// const Session = require('../models/session');
const { encrypt, decrypt } = require('../utils/security');
// const Redis = require('../utils/redis');
import * as type from '../constants/type';
import oracleConnect from '../models';
import * as moment from 'moment';
import AccountModel from '../models/AccountModel';
import UserModel from '../models/UserModel';
import { accountStatus } from '../constants/config';

const { JWT_SECRET_KEY, JWT_EXPIRES_TIME } = process.env;

// async function createSession(userId, accessToken) {
//   await Redis.setAsync(accessToken, JSON.stringify({ userId }));
//   await Session.create({ userId, accessToken });
// }

// async function deleteSession(accessToken) {
//   await Redis.delAsync(accessToken);
//   await Session.deleteMany({ accessToken });
// }

async function generateAccessToken(data) {
  const accessToken = jwt.sign(data, JWT_SECRET_KEY, {
    expiresIn: JWT_EXPIRES_TIME,
  });
  // createSession(data.userId, accessToken);

  return accessToken;
}

export function generateSalt() {
  return bcrypt.genSaltSync(10);
}

function hashSHA512(text) {
  return crypto
    .createHash('sha512')
    .update(text)
    .digest('hex');
}

async function hashBcrypt(text, salt) {
  const hashedBcrypt = new Promise((resolve, reject) => {
    bcrypt.hash(text, salt, (err, hash) => {
      if (err) reject(err);
      resolve(hash);
    });
  });
  return hashedBcrypt;
}

async function compareBcrypt(data, hashed) {
  const isCorrect = await new Promise((resolve, reject) => {
    bcrypt.compare(data, hashed, (err, same) => {
      if (err) reject(err);
      resolve(same);
    });
  });
  return isCorrect;
}

export async function encryptPassword(password) {
  const salt = generateSalt();
  // Transform the plaintext password to hash value using SHA512
  const hashedSHA512 = hashSHA512(password);
  // Hash using bcrypt with a cost of 10 and unique, per-user salt
  const hashedBcrypt = await hashBcrypt(hashedSHA512, salt);

  // Encrypt the resulting bcrypt hash with AES256
  const encryptAES256 = encrypt(hashedBcrypt);

  const encryptedPassword = encryptAES256;
  return encryptedPassword;
}

async function registerWithSocial(data) {
  console.log(data);
  // TODO
}

async function register(data: {
  password: string,
  userId: string,
  pwdMaxRetrieve: number,
  activeDate: number,
  role: string,
  userName: string,
  realDate: number
  }) {
    const pwd = await encryptPassword(data.password);
    delete data.password;
    console.log(data);
    return await new AccountModel({...data, pwd}).save();
  // const _id = await Counter.incrementCount(type.increment.registerAccount);

}

async function login(userName, password) {
  const account = await new AccountModel({ userName }).findOneUser();
  if (!account) throw new CustomError('ACCOUNT_NOT_FOUND');
  if (account.ACCOUNT_STATUS === accountStatus.LOCKED_BY_ADMIN)
    throw new CustomError('BLOCK_USER');
  const isCorrectPassword = await compareBcrypt(
    hashSHA512(password.trim()),
    decrypt(account.PWD),
  );
  if (!isCorrectPassword) throw new CustomError('ACCOUNT_NOT_FOUND');

  const { USER_ID: userId } = account;
  // const user = await UserService.getUserById({user_id});
  const user = await new UserModel({ userId }).findById();

  const accessToken = await generateAccessToken({
    userId,
    name: `${user.FIRST_NAME} ${user.MIDDLE_NAME} ${user.LAST_NAME}`,
  });
  return { user, accessToken };
}

export async function refreshToken(userData: {
  userId: number;
  name: string;
  roles?: any;
}) {
  return generateAccessToken(userData);
}

async function logout(accessToken) {
  // await deleteSession(accessToken);
}

async function verifyAccessToken(token = '', requireRefresh = true) {
  console.log('verifyAccessToken', token);
  const tokenSplit = token.split(' ');
  let accessToken = '';
  if (tokenSplit.length === 1) {
    [accessToken] = tokenSplit;
  } else {
    // eslint-disable-next-line
    accessToken = tokenSplit[1];
  }
  // const session = await Redis.getAsync(accessToken);
  // if (!session) {
  //   const sessionInDb = await Session.findOne({ accessToken });
  //   if (!sessionInDb) throw new CustomError(errorCodes.UNAUTHORIZED);
  // }
  const data = await jwt.verify(accessToken, JWT_SECRET_KEY);
  const { userId } = data;
  const acc = await new AccountModel({ userId }).findOneUser(true);
  if (!acc) throw new CustomError('UNAUTHORIZED');

  if (acc.ACCOUNT_STATUS === accountStatus.LOCKED_BY_ADMIN)
    throw new CustomError('BLOCK_USER');
  const newData = { ...data, roles: acc.ROLE };
  delete newData.iat;
  delete newData.exp;
  if (!requireRefresh) {
    return { data: newData };
  }
  const newToken = await generateAccessToken(newData);
  return { data: newData, accessToken: newToken };
}

async function changePassword(
  userId,
  password,
  newPassword,
  isManager = false,
) {
  const user = await User.findById(userId);
  if (!user) throw new CustomError('USER_NOT_FOUND');
  const userData = user.toJSON();
  const isCorrectPassword = await compareBcrypt(
    hashSHA512(password),
    decrypt(userData.password),
  );
  if (!isCorrectPassword && !isManager)
    throw new CustomError('DIFFERENT_PASSWORD');

  await User.findByIdAndUpdate(userId, {
    password: await encryptPassword(newPassword),
  });
  return { status: 1 };
}

async function resetPassword(body, isManager = false) {
  if (!isManager) throw new CustomError('BAD_REQUEST');
  return changePassword(body.userId, '', body.newPassword, isManager);
}
export {
  register,
  login,
  logout,
  verifyAccessToken,
  changePassword,
  resetPassword,
  registerWithSocial,
};
