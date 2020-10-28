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
      if(!tmp[key]) return;
      after[key.toLocaleUpperCase()] = tmp[key];
    });
    this.data = after;
  };
  public async insert(moreQuery?: string, params?: any) {
    const query = `
    insert into ${this.tableName} (${Object.keys(this.data)
      .join(',')
      .toLocaleUpperCase()})
    values 
    (${Object.keys(this.data)
      .map(
        key =>
         {
           let origin = false;
           if(typeof this.data[key] === 'string' && this.data[key].indexOf('data:') === 0) {
             origin = true;
            this.data[key] = this.data[key].replace('data:', '');
           }
          return `${
            typeof this.data[key] === 'number' || origin
              ? this.data[key]
              : `'${this.data[key]}'`
          }`
         },
      )
      .join(',')}) ${moreQuery || ''}`;
      console.log(query)
    return await this.connect.execute(query, params || [], {
      ...this.options
    });
  }

  public async execute(query: string, params?: any) {
    try {
      if (!this.connect) {
        await oracleConnect.connProm;
        this.connect = oracleConnect.conn;
      }
      console.log('query: ', query, '\noptions: ', this.options);

      const _data = await this.connect.execute(query, params || [], { ...this.options });
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
