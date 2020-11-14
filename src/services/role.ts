import errorCode from "src/constants/errors/code";
import RoleModel from "../models/RoleModel";

export const isPermissionBelongsToRole = (roleId: number, perId: number) => {
  return true;
};

export const addRole = (data: {name: string, code: string}) => {
  return new RoleModel({role_code: data.code, role_name: data.name}).save();
};

export const getRoles = () => {
  return new RoleModel({}).findAll();
};
