import oracleConnect from '.';
import { transformObjectId } from '../middlewares/snakeCaseRes';
import CustomError from '../constants/errors/CustomError';
const snakecaseKeys = require('snakecase-keys');

export default class ModelBase<T> {
  tableName: string;
  data: T;
  result: any;
  meta: any;
  options: any = {
    autoCommit: true,
  };
  connect = oracleConnect.conn;
  constructor(_data, _options?: any) {
    if (!_data) throw new CustomError('INTERNAL_SERVER_ERROR');
    this.convertData(_data);
    if (_options) {
      this.options = _options;
    }
  }

  convertData = (_data: any) => {
    const tmp = snakecaseKeys(transformObjectId(_data), { deep: true });
    const after: any = {};
    Object.keys(tmp).forEach(key => {
      after[key.toLocaleUpperCase()] = tmp[key];
    });
    this.data = after;
  };
  public async insert() {
    try {
      const query = `
    insert into ${this.tableName} (${Object.keys(this.data)
        .join(',')
        .toLocaleUpperCase()})
    values 
    (${Object.keys(this.data)
      .map(
        key =>
          `${
            typeof this.data[key] === 'number'
              ? this.data[key]
              : `'${this.data[key]}'`
          }`,
      )
      .join(',')})`;
      return await this.connect.execute(query, [], { ...this.options });
    } catch (error) {
      console.log('excute error');
      throw new Error(error);
    }
  }

  public async execute(query: string) {
    try {
      if (!this.connect) {
        await oracleConnect.connProm;
        this.connect = oracleConnect.conn;
      }
      console.log('query: ', query, '\noptions: ', this.options);

      const _data = await this.connect.execute(query, [], { ...this.options });
      this.meta = _data.metaData;
      return _data;
    } catch (error) {
      console.log('execute', error);
      throw new Error(error);
    }
  }

  public async find(condition: string, fields: string[], limit?: number) {
    const query = `
      select ${fields.join(',')} from ${this.tableName}
      where ${condition}
      ${limit ? `FETCH FIRST ${limit} ROW ONLY` : ''}
    `;
    const rs = await this.execute(query);
    return rs.rows;
  }
}
