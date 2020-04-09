const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const CustomError = require('../constants/errors/CustomError');
const errorCodes = require('../constants/errors/code');

const User = require('../models/user');
const UserService = require('./user');
const Account = require('../models/account');
const Session = require('../models/session');
const Counter = require('../models/counter');
const { encrypt, decrypt } = require('../utils/security');
const Redis = require('../utils/redis');
const type = require('../constants/type');

const { JWT_SECRET_KEY, JWT_EXPIRES_TIME } = process.env;

async function createSession(userId, accessToken) {
  await Redis.setAsync(accessToken, JSON.stringify({ userId }));
  await Session.create({ userId, accessToken });
}

async function deleteSession(accessToken) {
  await Redis.delAsync(accessToken);
  await Session.deleteMany({ accessToken });
}

async function generateAccessToken(userId) {
  const accessToken = jwt.sign({ user_id: userId }, JWT_SECRET_KEY, {
    expiresIn: JWT_EXPIRES_TIME,
  });
  createSession(userId, accessToken);

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
  const { email, password, accName } = data;
  const isAccountExist = await Account.findOne({
    $or: [{ email }, { accName }],
  });
  if (isAccountExist) throw new CustomError(errorCodes.USER_ALREADY_EXISTS);

  const salt = generateSalt();

  const _id = await Counter.incrementCount(type.increment.registerAccount);

  await Account.create({
    _id,
    accName,
    email,
    password: await encryptPassword(password, salt),
    salt,
    type: type.accType.system,
  });
  await UserService.createUser(_id, data);
}

async function login(email, password) {
  const user = await User.findOne({ email });
  if (!user) throw new CustomError(errorCodes.NOT_FOUND_EMAIL);
  if (user.status === type.accStatus.inactive)
    throw new CustomError(errorCodes.BLOCK_USER);
  const { _id: userId } = user;
  const isCorrectPassword = await compareBcrypt(
    hashSHA512(password),
    decrypt(user.password),
  );
  if (!isCorrectPassword) throw new CustomError(errorCodes.DIFFERENT_PASSWORD);
  const accessToken = await generateAccessToken(userId);
  return accessToken;
}

async function logout(accessToken) {
  await deleteSession(accessToken);
}

async function verifyAccessToken(token = '') {
  try {
    const tokenSplit = token.split(' ');
    let accessToken = '';
    if (tokenSplit.length === 1) {
      [accessToken] = tokenSplit;
    } else {
      // eslint-disable-next-line
      accessToken = tokenSplit[1];
    }
    const session = await Redis.getAsync(accessToken);
    if (!session) {
      const sessionInDb = await Session.findOne({ accessToken });
      if (!sessionInDb) throw new CustomError(errorCodes.UNAUTHORIZED);
    }

    const data = await jwt.verify(accessToken, JWT_SECRET_KEY);
    const { user_id: userId } = data;
    const user = await User.findById(userId);

    if (!user) throw new CustomError(errorCodes.UNAUTHORIZED);
    if (user.status === type.accStatus.inactive)
      throw new CustomError(errorCodes.BLOCK_USER);
    return { data, user: user.toJSON() };
  } catch (error) {
    return {};
  }
}

async function changePassword(
  userId,
  password,
  newPassword,
  isManager = false,
) {
  const user = await User.findById(userId);
  if (!user) throw CustomError(errorCodes.USER_NOT_FOUND);

  let { salt } = user;
  const isCorrectPassword = await compareBcrypt(
    hashSHA512(password),
    decrypt(user.password),
  );
  if (!isCorrectPassword && !isManager)
    throw new CustomError(errorCodes.DIFFERENT_PASSWORD);
  if (!salt) {
    salt = generateSalt();
  }
  await User.findByIdAndUpdate(userId, {
    password: await encryptPassword(newPassword, salt),
    salt,
  });
  return { status: 1 };
}

async function resetPassword(body, isManager = false) {
  if (!isManager) throw new CustomError(errorCodes.BAD_REQUEST);
  return changePassword(body.userId, '', body.newPassword, isManager);
}
module.exports = {
  register,
  login,
  logout,
  verifyAccessToken,
  changePassword,
  resetPassword,
  registerWithSocial,
};
