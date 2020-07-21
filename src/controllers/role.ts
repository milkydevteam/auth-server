import * as RoleService from '../services/role';

async function addRole(req, res) {
  const { name } = req.body;
  const role = await RoleService.addRole(name);
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

export { addRole, updateRole, getRoles };
