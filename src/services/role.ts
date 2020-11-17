import PermissionModel, {PermissionNotConvert} from "../models/PermissionModel";
import RoleModel from "../models/RoleModel";

export const isPermissionBelongsToRole = (roleId: number, perId: number) => {
  return true;
};

export const addRole = (data: {roleName: string, roleCode: string}) => {
  return new RoleModel(data).save();
};

export const getRoles = () => {
  return new RoleModel({}).findAll();
};

export const getPermissionByRole = (roleId: number) => {
  return new PermissionModel({roleId}).getByRole();
}

export const updatePermissionInRole = ({roleId, permissions}: {roleId: number, permissions: PermissionNotConvert[]}) => {
  return new PermissionModel({roleId}).updatePermissions(permissions);
}