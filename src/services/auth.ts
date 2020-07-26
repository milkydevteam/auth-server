import CustomError from '../constants/errors/CustomError';
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

import UserModel from '../models/user';
import Account from '../models/account';
import * as UserService from './user';
import Counter from '../models/counter';
// const Session = require('../models/session');
const { encrypt, decrypt } = require('../utils/security');
// const Redis = require('../utils/redis');
import * as type from '../constants/type';

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

function generateSalt() {
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

async function encryptPassword(password, salt) {
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

async function register(data) {
  const { email, password, userName } = data;
  const isAccountExist = await Account.findOne({
    $or: [{ email }, { userName }],
  });
  if (isAccountExist) {
    throw new CustomError('USER_ALREADY_EXISTS');
  }
  const salt = generateSalt();
  const _id = await Counter.incrementCount(type.increment.registerAccount);

  await Account.create({
    _id,
    userName,
    email,
    password: await encryptPassword(password, salt),
    salt,
    type: type.accType.system,
  });
  await UserService.createUser(_id, data);
}

async function login(userName, password) {
  const account = await Account.findOne({ userName });
  if (!account) throw new CustomError('ACCOUNT_NOT_FOUND');
  if (account.status === type.accStatus.inactive)
    throw new CustomError('BLOCK_USER');
  const isCorrectPassword = await compareBcrypt(
    hashSHA512(password),
    decrypt(account.password),
  );
  if (!isCorrectPassword) throw new CustomError('ACCOUNT_NOT_FOUND');
  const { _id: userId } = account;
  const user = await UserService.getUserById(userId);
  const accessToken = await generateAccessToken({ userId, name: user.name });
  return accessToken;
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

async function verifyAccessToken(token = '') {
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
  const user = await UserModel.findById(userId);
  if (!user) throw new CustomError('UNAUTHORIZED');
  const userData = user.toJSON();
  if (userData.status === type.accStatus.inactive)
    throw new CustomError('BLOCK_USER');
  const userJson: type.UserType = user.toJSON();
  return { data, user: userJson };
}

async function changePassword(
  userId,
  password,
  newPassword,
  isManager = false,
) {
  const user = await UserModel.findById(userId);
  if (!user) throw new CustomError('USER_NOT_FOUND');
  const userData = user.toJSON();
  let { salt } = userData;
  const isCorrectPassword = await compareBcrypt(
    hashSHA512(password),
    decrypt(userData.password),
  );
  if (!isCorrectPassword && !isManager)
    throw new CustomError('DIFFERENT_PASSWORD');
  if (!salt) {
    salt = generateSalt();
  }
  await UserModel.findByIdAndUpdate(userId, {
    password: await encryptPassword(newPassword, salt),
    salt,
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
