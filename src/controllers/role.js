const roleService = require('../services/role');
const { userType } = require('../constants/type');

async function addRole(req, res) {
  const { name } = req.body;
  const role = await roleService.addRole(name);
  return res.send({ status: 1, result: role });
}

async function updateRole(req, res) {
  const { roleId } = req.params;
  const updateFields = req.body;
  const updatedRole = await roleService.updateRole(roleId, updateFields);
  return res.send({ status: 1, result: updatedRole });
}

async function getRoles(req, res) {
  const { code } = req.query;
  let role = {};
  let count = 0;
  if (code) {
    role = userType[code.toLocaleUpperCase()];
    if (role) {
      count = 1;
    }
  } else {
    role = userType;
    count = Object.keys(userType).length;
  }
  return res.send({
    status: 1,
    result: { role, metadata: { total: count } },
  });
}

module.exports = { addRole, updateRole, getRoles };
