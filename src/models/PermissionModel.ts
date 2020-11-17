import ModelBase from './ModelBase';
import * as OracleDB from 'oracledb';

interface PermissionType {
  SLUG?: string;
  PER_CODE?: string;
  ROLE_ID?: number;
  PER_NAME?: string;
}

export interface PermissionNotConvert {
  roleId?: number;
  perCode?: string;
  slug?: string;
  perName?: string;
}

export default class PermissionModel extends ModelBase<PermissionType> {
  constructor(_data: PermissionNotConvert, _option?: { autoCommit?: boolean }) {
    super(_data, _option);
    this.tableName = 'CMS_HAS_ROLE';
  }
  public save() {
    return this.insert();
  }
  async updatePermissions(pers: PermissionNotConvert[]) {
    let deleteQuery = ` DELETE
                        FROM ${this.tableName} 
                        WHERE ROLE_ID = ${this.data.ROLE_ID} `;
    let query = `insert all `;
    pers.forEach((per) => {
      query += ` into ${this.tableName} (role_id, per_code, slug, per_name) values (${this.data.ROLE_ID}, '${per.perCode}', '${per.slug}', '${per.perName}')`;
    })
    query += ' select * from dual'
    try {
      const rs = await this.execute(deleteQuery, {}, {autoCommit: false});
      await this.execute(query, {}, {autoCommit: false});
      await this.connect.commit();

      return true;
    } catch (error) {
      console.log(error);
      await this.connect.rollback();
      throw new Error(error.message);
    }
  }
  async getByRole() {
    const query = `
      select * 
      from ${this.tableName}
      where role_id=${this.data.ROLE_ID}
    `;
    const rs = await this.execute(query);
    const _data: PermissionType | undefined = rs.rows;
    return _data;
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
