import ModelBase from './ModelBase';

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
  save = async () => {
    this.insert();
    // return this.connect.excuteQuery(
    //   `insert into CMS_USER (USER_ID, FIRST_NAME, MIDDLE_NAME, LAST_NAME, ADDRESS, EMAIL, BRANCH_ID)
    //    values
    //    ('${data.user_id}', '${data.first_name}', '${data.middle_name}', '${data.last_name}', '${data.address}', '${data.email}', '${data.branch_id}')`,
    //   false,
    // );
  };
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
