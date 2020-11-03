import ModelBase from './ModelBase';
import CustomError from '../constants/errors/CustomError';
import * as moment from 'moment';
import oracleConnect from '.';
import { pwdMaxRetrieve } from '../constants/config';

interface AccountType {
  PWD?: string;
  PWD_STATUS?: number;
  PWD_UPDATED_TIME?: number;
  PWD_MAX_RETRIEVE?: number;
  ACCOUNT_STATUS?: number;
  PWD_RETRIED?: number;
  ROLE?: string;
  USER_ID?: string;
  REAL_DATE?: number | string;
  ACTIVE_DATE?: number | string;
  CREATED_TIME?: number | string;
  EMAIL?: string;
  USER_NAME?: string
}

interface AccountNotConvert {
  pwd?: string;
  pwdStatus?: number;
  pwdUpdatedTime?: number;
  pwdMaxRetrieve?: number;
  accountStatus?: number;
  pwdTried?: number;
  role?: string;
  userId?: string;
  realDate?: number;
  activeDate?: number;
  createdTime?: number;
  email?: string;
  userName?: string;
}

export default class AccountModel extends ModelBase<AccountType> {
  constructor(_data: AccountNotConvert, _option?: { autoCommit?: boolean }) {
    super(_data, _option);
    this.tableName = 'CMS_ACCOUNT';
  }
  public save() {
    const { data } = this;
    const activeDate = moment( Number.parseInt(data.ACTIVE_DATE as string)*1000).format('DD/MM/YYYY');
    const realDate = moment( Number.parseInt(data.REAL_DATE as string)*1000).format('DD/MM/YYYY');
    this.data.ACTIVE_DATE = `data:to_date('${activeDate}', 'DD/MM/YYYY')`;
    this.data.CREATED_TIME = "data:CURRENT_TIMESTAMP";
    this.data.REAL_DATE = `data:to_date('${realDate}', 'DD/MM/YYYY')`;
    return this.insert();
  }
  public async findOneUser(withUserId = false) {
    const query = `
      select * 
      from ${this.tableName}
      where ${withUserId ? ` USER_ID = '${this.data.USER_ID}` : ` USER_NAME = '${this.data.USER_NAME}`}'
    `;
    const rs = await this.execute(query);
    const _data: AccountType | undefined = rs.rows[0];
    return _data;
  }
  getValue(field: string) {}
}
