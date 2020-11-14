import ModelBase from './ModelBase';

interface PermissionType {
  SLUG?: string;
  PERMISSION_CODE?: string;
  ROLE_ID?: number;
}

interface PermissionNotConvert {
  roleId?: number;
  permissionCode?: string;
  slug?: string;
}

export default class PermissionModel extends ModelBase<PermissionType> {
  constructor(_data: PermissionNotConvert, _option?: { autoCommit?: boolean }) {
    super(_data, _option);
    this.tableName = 'CMS_HAS_ROLE';
  }
  public save() {
    
    return this.insert();
  }
  public async findAll() {
    const query = `
      select * 
      from ${this.tableName}
    `;
    const rs = await this.execute(query);
    const _data: PermissionType | undefined = rs.rows[0];
    return _data;
  }
  getValue(field: string) {}
}
