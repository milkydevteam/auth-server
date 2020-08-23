import ModelBase from './ModelBase';
import CustomError from '../constants/errors/CustomError';
import * as moment from 'moment';
import oracleConnect from '.';

interface AccountType {
  PWD?: string;
  PWD_STATUS?: number;
  PWD_UPDATED_TIME?: number;
  PWD_MAX_RETRIEVE?: number;
  ACCOUNT_STATUS?: number;
  PWD_RETRIED?: number;
  ROLES?: string;
  USER_ID?: string;
  REAL_DATE?: number;
  ACTIVE_DATE?: number;
  CREATED_TIME?: number;
}

interface AccountNotConvert {
  pwd?: string;
  pwdStatus?: number;
  pwdUpdatedTime?: number;
  pwdMaxRetrieve?: number;
  accountStatus?: number;
  pwdTried?: number;
  roles?: string;
  userId?: string;
  realDate?: number;
  activeDate?: number;
  createdTime?: number;
}

export default class AccountModel extends ModelBase<AccountType> {
  constructor(_data: AccountNotConvert, _option?: { autoCommit?: boolean }) {
    super(_data, _option);
    this.tableName = 'CMS_ACCOUNT';
  }
  public save() {
    const { data } = this;
    const activeDate = moment(data.ACTIVE_DATE).format('DD/MM/YYYY');
    const realDate = moment(data.REAL_DATE).format('DD/MM/YYYY');
    const query = `insert into ${this.tableName} 
    (USER_ID, PWD, PWD_MAX_RETRIEVE,
      ROLES, REAL_DATE, CREATED_TIME, ACTIVE_DATE )
   values 
   ('${data.USER_ID}', '${data.PWD}', ${data.PWD_MAX_RETRIEVE},
   '${data.ROLES}', to_date('${realDate}', 'DD/MM/YYYY'), CURRENT_TIMESTAMP, to_date('${activeDate}', 'DD/MM/YYYY'))`;
    return this.execute(query);
  }
  public async findById() {
    const query = `
      select * 
      from ${this.tableName}
      where USER_ID = '${this.data.USER_ID}'
    `;
    const rs = await this.execute(query);
    const _data: AccountType | undefined = rs.rows[0];
    return _data;
  }
  getValue(field: string) {}
}
