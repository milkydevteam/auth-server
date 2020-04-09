const permissionService = require('../services/permission');

async function addPermission(req, res) {
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

async function updatePermission(req, res) {
  const { permissionId } = req.params;
  const updateFields = req.body;
  const updatedPermission = await permissionService.updatePermission(
    permissionId,
    updateFields,
  );
  return res.send({ status: 1, result: updatedPermission });
}

async function getPermissions(req, res) {
  const { search, fields, offset, limit, sort } = req.query;
  const query = {};
  query.query = {};
  if (search) query.search = search;
  if (fields) query.fields = fields.split(',');
  if (offset) query.offset = parseInt(offset, 10);
  if (limit) query.limit = parseInt(limit, 10);
  if (sort) query.sort = sort.split(',');
  Object.keys(req.query)
    .filter(
      (q) => ['search', 'fields', 'offset', 'limit', 'sort'].indexOf(q) === -1,
    )
    .forEach((q) => {
      query.query[q] = ['true', 'false'].includes(req.query[q])
        ? JSON.parse(req.query[q])
        : req.query[q];
    });

  const { permissions, count } = await permissionService.findAll(query);
  return res.send({
    status: 1,
    result: { permissions, metadata: { total: count } },
  });
}

async function getPermissionsByRole(req, res) {
  const { roleId } = req.account;
  const permissions = await permissionService.getPermissionsByRole(roleId);
  return res.send({ status: 1, result: permissions });
}

module.exports = {
  addPermission,
  updatePermission,
  getPermissions,
  getPermissionsByRole,
};
