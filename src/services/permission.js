const CustomError = require('../constants/errors/CustomError');
const errorCodes = require('../constants/errors/code');
const Permission = require('../models/permission');
const Role = require('../models/role');

async function isValidPermissions(permissionIds) {
  for (const permissionId of permissionIds) {
    const permission = await Permission.findById(permissionId);
    if (!permission) return false;
  }
  return true;
}

async function addPermission({ name, backendKey, frontendKey }) {
  const $or = [];
  if (frontendKey) {
    $or.push({ frontendKey });
  }

  if (backendKey) {
    const { method, routePath } = backendKey;
    $or.push({
      'backendKey.method': method,
      'backendKey.routePath': routePath,
    });
  }

  const isPermissionExist = await Permission.findOne({ $or });
  if (isPermissionExist)
    throw new CustomError(errorCodes.BAD_REQUEST, 'Permission is exists');

  const permission = await Permission.create({
    name,
    backendKey: backendKey
      ? { method: backendKey.method, routePath: backendKey.routePath }
      : undefined,
    frontendKey,
  });
  return permission;
}

async function updatePermission(permissionId, updateFields) {
  const permission = await Permission.findById(permissionId);
  if (!permission)
    throw new CustomError(errorCodes.BAD_REQUEST, 'Permission is not exists');

  const { backendKey, frontendKey } = updateFields;
  const { method, routePath } = backendKey;

  if (backendKey) {
    const isPermissionExist = await Permission.findOne({
      'backendKey.method': method,
      'backend.routePath': routePath,
    });
    if (isPermissionExist)
      throw new CustomError(errorCodes.BAD_REQUEST, 'Permission is exist');
  }

  if (frontendKey) {
    const isPermissionExist = await Permission.findOne({
      frontendKey,
    });
    if (isPermissionExist)
      throw new CustomError(errorCodes.BAD_REQUEST, 'Permission is exist');
  }

  const updatedPermission = await Permission.findByIdAndUpdate(
    permissionId,
    updateFields,
    { new: true },
  );
  return updatedPermission;
}

async function getPermissionsByRole(roleId) {
  const role = await Role.findById(roleId);
  const { permissionIds } = role;
  const permissions = await Permission.find({ _id: { $in: permissionIds } });
  return permissions.map(permission => permission.frontendKey);
}

module.exports = {
  isValidPermissions,
  addPermission,
  updatePermission,
  getPermissionsByRole,
};
