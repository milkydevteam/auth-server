import asyncMiddleware from './async';
import * as authService from '../services/auth';
import CustomError from '../constants/errors/CustomError';
import { parseJwt } from '../utils/parseJwt';

async function auth(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization) throw new CustomError('UNAUTHORIZED');

  const [tokenType, accessToken] = authorization.split(' ');
  if (tokenType !== 'Bearer') throw new Error();
  const { data } = await authService.verifyAccessToken(accessToken, false);
  if (data) {
    req.user = {
      ...data,
    };
    console.log(req.user);
  }
  if (['/auths/logout', '/auths/verify'].includes(req.path)) {
    req.accessToken = accessToken;
  }
  return next();
}

const asyncAuth = asyncMiddleware(auth);
export default asyncAuth;
