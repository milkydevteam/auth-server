import * as authService from '../services/auth';
import * as userService from '../services/user';
import CustomError from '../constants/errors/CustomError';
import { Request, Response } from 'express';
import { MyRequest } from '../constants/type';
import { validatePassword } from '../utils/validate';
import { checkUserField, checkAuthField } from '../utils/check';
import { defaultPwd } from '../constants/config';
export async function createAccount(data) {
  checkAuthField(data, 'create');
  let {
    email,
    password,
    confirmPassword,
    role,
    userName,
    passwordMaxRetrieve,
    useDefaultPwd,
    realDate,
    roleCode,
    activeDate,
    userId
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
    if (!role || role.length === 0)
      throw new CustomError('BAD_REQUEST', {
        message: 'The role of user is required',
      });
  }
  return await authService.register({
    password,
    role,
    userId,
    pwdMaxRetrieve: passwordMaxRetrieve,
    realDate,
    activeDate,
    userName
  })

}

export async function login(req, res) {
  const { userName, password } = req.body;
  if (!userName || !password) throw new CustomError('NOT_FULL_INFO');
  const { user, accessToken } = await authService.login(userName, password);
  res.send({ status: 1, result: { accessToken, user } });
}

export const register = async (req: Request, res: Response) => {
  if (!req.body) {
    throw new CustomError('REGISTER_INCLUDE');
  }
  const {
    email
  } = req.body;
  if(!email) {
    throw new CustomError('BAD_REQUEST', {message: "Email is invalid"});
  }

  const splitEmail = email.split('@');
  if(splitEmail.length !== 2) throw new CustomError('BAD_REQUEST', {message: 'Email is invalid'});

  let userName = splitEmail[0];
  const userId = await userService.createUserOnlyEmail(email);
  if(!userId) {
    throw new CustomError('INTERNAL_SERVER_ERROR', {message: "Don't create user success"});
  }
  await createAccount({...req.body, userName, userId});

  res.send({ status: 1, data: {
    userName
  } });
};

export async function logout(req, res) {
  const { accessToken } = req;
  await authService.logout(accessToken);
  req.accessToken = null;
  req.user = null;
  req.userId = null;
  return res.send({ status: 1 });
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

export async function verifyAccessToken(req: Request, res: Response) {
  const { authorization } = req.headers;
  const { data, accessToken } = await authService.verifyAccessToken(
    authorization,
  );
  if (data) {
    return res.send({
      status: 1,
      result: {
        user: data,
        accessToken,
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
