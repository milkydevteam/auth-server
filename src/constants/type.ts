import { Request } from 'express';
export const increment = {
  registerAccount: 'userCounter',
};
export const accStatus = {
  active: 'active',
  inactive: 'inactive',
};
export const accType = {
  system: 'USER_PASSWORD',
  social: 'SOCIAL',
};
export interface MyRequest extends Request {
  user?: {
    userId: number;
    roles?: any;
    name: string;
  }; // or any other type
}
export interface UserType {
  _id: Number;
  name: String;
  avatar: String; // luu file, sau do de duong dan vao day,
  address: String;
  phone: String;
  url: String;
  email?: String;
  roles?: any;
}
