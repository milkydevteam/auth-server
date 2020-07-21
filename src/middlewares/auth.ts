import asyncMiddleware from './async';
import * as authService from '../services/auth';
const CustomError = require('../constants/errors/CustomError');
const codes = require('../constants/errors/code');

async function auth(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization) throw new CustomError(codes.UNAUTHORIZED);

  const [tokenType, accessToken] = authorization.split(' ');
  if (tokenType !== 'Bearer') throw new Error();
  const { user } = await authService.verifyAccessToken(accessToken);

  if (user) {
    req.user = {
      userId: user._id,
      roles: user.roles,
    };
  }
  if (['/auths/logout', '/auths/verify'].includes(req.path)) {
    req.accessToken = accessToken;
  }
  return next();
}

const asyncAuth = asyncMiddleware(auth);
export default asyncAuth;
