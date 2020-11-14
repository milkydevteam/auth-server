import CustomError from '../constants/errors/CustomError';
import * as RoleService from '../services/role';

async function createRole(req, res) {
  const { name, code, permissions } = req.body;
  if(!name || !code) {
    throw new CustomError('NOT_FULL_INFO')
  }
  if(code === 'root' || code === 'admin') throw new CustomError('BAD_REQUEST', 'code is invalid');
  const role = await RoleService.addRole({name, code});
  return res.send({ status: 1 });
}


async function getRoles(req, res) {
  const data = await RoleService.getRoles();
  return res.send({
    status: 1,
    result: { data },
  });
}

export { createRole, getRoles };
