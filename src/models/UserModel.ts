import CustomError from '../constants/errors/CustomError';
import errorHandler from '../middlewares/errorHandler';
import ModelBase from './ModelBase';
import * as OracleDB from 'oracledb';

interface UserType {
  USER_ID?: string;
  FIRST_NAME?: string;
  MIDDLE_NAME?: string;
  LAST_NAME?: string;
  ADDRESS?: string;
  EMAIL?: string;
  BRANCH_ID?: string;
  OTHERS?: string;
}

interface UserNotConvertType {
  userId?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  address?: string;
  email?: string;
  branchId?: string;
  others?: string;
}

export default class UserModel extends ModelBase<UserType> {
  constructor(_data: UserNotConvertType, _options?: { autoCommit?: boolean }) {
    super(_data, _options);
    this.tableName = 'CMS_USER';
  }
  manySave = async () => {
  }
  save = async () => {
    try {
      const params = {
        user_id: {
          type: OracleDB.NUMBER,
          dir: OracleDB.BIND_OUT
        }
      }
      const rs = await this.insert('returning USER_ID into :user_id', params);
      let userId = 0;
      const out: any = rs?.outBinds;
      if(out) {
        userId = out.user_id[0];
      }
      return userId;
    } catch (error) {
      if (error.message && error.message.includes('VCBAPP1.CMS_USER_UK1')) {
        throw new CustomError('USER_ALREADY_EXISTS');
      }
      throw Error(error.message);
    }
  };
  updateBasicInfor = async (userId: number) => {
    const query = `
      update ${this.tableName}
      set ${Object.keys(this.data).map(key => `${key}='${this.data[key]}'`).join(', ')}
      where user_id=${userId}
      `;
    await  this.execute(query);
  }
  public async findById() {
    const query = `
      select * from ${this.tableName}
      where user_id = '${this.data.USER_ID}'
      FETCH FIRST 1 ROW ONLY
    `;
    const rs = await this.execute(query);
    const _data: UserType | undefined = rs.rows[0];
    return _data;
  }
}
