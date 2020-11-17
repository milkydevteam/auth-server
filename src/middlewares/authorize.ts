import CustomError from '../constants/errors/CustomError';
import codes from '../constants/errors/code';
import * as roleService from '../services/role';
import asyncMiddleware from './async';
// const Permission = require('../models/permission');

async function authorize(req, res, next) {
  const { user } = req;
  const {
    method,
    route: { path: routePath },
  } = req;
  return next();
  // const permission = await Permission.findOne({
  //   backendKey: { method, routePath },
  // });

  // const isRoleContainPermission = await roleService.isPermissionBelongsToRole(
  //   account.roleId,
  //   permission._id,
  // );
  // if (isRoleContainPermission) return next();
  // throw new CustomError(codes.FORBIDDEN);
}

const asyncAuthorize = asyncMiddleware(authorize);
export default asyncAuthorize;
