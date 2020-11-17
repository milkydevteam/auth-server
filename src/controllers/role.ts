import CustomError from '../constants/errors/CustomError';
import * as RoleService from '../services/role';

async function createRole(req, res) {
  const { roleCode, roleName } = req.body;
  if(!roleName || !roleCode) {
    throw new CustomError('NOT_FULL_INFO')
  }
  if(roleCode === 'cms_root_sys' || roleCode === 'cms_adminis_sys') throw new CustomError('BAD_REQUEST', 'code is invalid');
  await RoleService.addRole({roleName, roleCode});
  return res.send({ status: 1 });
}


async function getRoles(req, res) {
  const data = await RoleService.getRoles();
  return res.send({
    status: 1,
    result: { data },
  });
}

export async function updatePermissionInRole(req, res) {
  const {  permissions } = req.body;
  const { roleId: tmpRoleId } = req.params;
  const roleId = Number.parseInt(tmpRoleId);
  if(!permissions) {
    throw new CustomError('NOT_FULL_INFO')
  }
  if(roleId === 1 || roleId === 2) throw new CustomError('BAD_REQUEST', 'role id is invalid');
  const rs = await RoleService.updatePermissionInRole({roleId, permissions});

  return res.send({ status: 1 });
}

export async function getPermissionsInRole(req, res) {
  const {id} = req.params;
  if(!id) throw new CustomError('BAD_REQUEST', 'code is invalid');
  const permissions = await RoleService.getPermissionByRole(id);
  return res.send({
    status: 1,
    result: { permissions },
  });
}

export { createRole, getRoles };
