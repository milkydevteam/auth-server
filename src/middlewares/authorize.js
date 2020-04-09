const CustomError = require('../constants/errors/CustomError');
const codes = require('../constants/errors/code');
// const Permission = require('../models/permission');
const roleService = require('../services/role');
const asyncMiddleware = require('./async');

async function authorize(req, res, next) {
  const { account } = req;
  const {
    method,
    route: { path: routePath },
  } = req;
  return next;
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

module.exports = asyncMiddleware(authorize);
