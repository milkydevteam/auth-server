import * as authService from '../services/auth';
import CustomError from '../constants/errors/CustomError';
import { Request, Response } from 'express';
import { MyRequest } from '../constants/type';
import { validatePassword } from '../utils/validate';
import { checkAuthField } from '../utils/check';
import { defaultPwd } from '../constants/config';
export async function createAccount(data) {
  checkAuthField(data, 'create');
  let {
    password,
    confirmPassword,
    roles,
    userId,
    passwordMaxRetrieve,
    useDefaultPwd,
    realDate,
    roleCode,
    activeDate,
  } = data;

  if (useDefaultPwd) {
    password = defaultPwd;
  } else {
    if (!validatePassword(password))
      throw new CustomError('BAD_REQUEST', {
        message: 'The password is invalid',
      });
    if (password !== confirmPassword)
      throw new CustomError('BAD_REQUEST', {
        message: 'The confirm password is incorrect',
      });
  }
  if (roleCode) {
    // TODO
  } else {
    if (!roles || roles.length === 0)
      throw new CustomError('BAD_REQUEST', {
        message: 'The roles of user is required',
      });
  }
  await authService.createAccount({
    password,
    roles,
    userId,
    passwordMaxRetrieve,
    realDate,
    activeDate,
  });
}

export async function login(req, res) {
  const { userName, password } = req.body;
  const { user, accessToken } = await authService.login(userName, password);
  res.send({ status: 1, result: { accessToken, user } });
}

export async function refreshToken(req: MyRequest, res: Response) {
  const { user } = req;
  const accessToken = await authService.refreshToken({
    userId: user.userId,
    name: user.name,
    // roles: user.roles,
  });
  res.send({ status: 1, result: { accessToken } });
}

export const register = async (req: Request, res: Response) => {
  if (!req.body) {
    throw new CustomError('REGISTER_INCLUDE');
  }
  const isExist = ['email', 'userName', 'password', 'name'].every(param => {
    return Object.keys(req.body).includes(param);
  });

  if (!isExist) {
    throw new CustomError('REGISTER_INCLUDE');
  }

  await authService.register(req.body);
  res.send({ status: 1 });
};

export async function logout(req, res) {
  const { accessToken } = req;
  await authService.logout(accessToken);
  req.accessToken = null;
  req.user = null;
  req.userId = null;
  return res.send({ status: 1 });
}

export async function verifyAccessToken(req: Request, res: Response) {
  const { authorization } = req.headers;
  const { user } = await authService.verifyAccessToken(authorization);
  if (user) {
    return res.send({
      status: 1,
      result: {
        success: 1,
      },
    });
  }
  throw new CustomError('USER_NOT_FOUND');
}

export async function changePassword(req, res) {
  // const { password, newPassword, userId } = req.body;
  // await authService.changePassword(userId, password, newPassword);
  console.log(req.user);
  return res.send({ status: 1, user: req.user });
}
