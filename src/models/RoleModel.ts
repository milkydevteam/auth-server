import ModelBase from './ModelBase';
interface RoleType {
  ROLE_ID?: number;
  ROLE_CODE?: string;
  ROLE_NAME?: string;
}

interface RoleNotConvert {
  roleId?: number;
  roleCode?: string;
  roleName?: string;
}

export default class RoleModel extends ModelBase<RoleType> {
  constructor(_data: RoleNotConvert, _option?: { autoCommit?: boolean }) {
    super(_data, _option);
    this.tableName = 'CMS_ROLE_GROUP';
  }
  public save() {
    
    return this.insert();
  }

  /**
   * Dùng để liệt kê các role đang có, để cho admin phân quyền cho user
   */
  public async findAll() {
    const query = `
      select * 
      from ${this.tableName}
    `;
    const rs = await this.execute(query);
    const _data: RoleType[] | undefined = rs.rows;
    
    return _data.filter(role => role.ROLE_CODE !== 'cms_root_sys');
  }
  getValue(field: string) {}
}
