import * as permissionService from '../services/permission';

export async function addPermission(req, res) {
  const {
    name,
    backendKey: { method, routePath },
    frontendKey,
  } = req.body;
  const role = await permissionService.addPermission({
    name,
    backendKey: { method, routePath },
    frontendKey,
  });
  return res.send({ status: 1, result: role });
}

export async function updatePermission(req, res) {
  const { permissionId } = req.params;
  const updateFields = req.body;
  const updatedPermission = await permissionService.updatePermission(
    permissionId,
    updateFields,
  );
  return res.send({ status: 1, result: updatedPermission });
}

export async function getPermissions(req, res) {
  const { search, fields, offset, limit, sort } = req.query;
 
  return res.send({
    status: 1,
    result: { },
  });
}

export async function getPermissionsByRole(req, res) {
  const { roleId } = req.account;
  const permissions = await permissionService.getPermissionsByRole(roleId);
  return res.send({ status: 1, result: permissions });
}
