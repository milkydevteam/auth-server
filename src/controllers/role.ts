import CustomError from 'src/constants/errors/CustomError';
import * as RoleService from '../services/role';

async function createRole(req, res) {
  const { name, code, permissions } = req.body;
  if(!name || !code || !permissions) {
    throw new CustomError('NOT_FULL_INFO')
  }
  const role = await RoleService.addRole({name, code, permissions});
  return res.send({ status: 1, result: role });
}

async function updateRole(req, res) {
  const { roleId } = req.params;
  const updateFields = req.body;
  const updatedRole = await RoleService.updateRole(roleId, updateFields);
  return res.send({ status: 1, result: updatedRole });
}

async function getRoles(req, res) {
  const { code } = req.query;
  let role = {};
  let count = 0;

  return res.send({
    status: 1,
    result: { role, metadata: { total: count } },
  });
}

export { createRole, updateRole, getRoles };
