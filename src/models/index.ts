import * as OracleDB from 'oracledb';
// @ts-ignore
OracleDB.outFormat = OracleDB.OUT_FORMAT_OBJECT;
export class ConnectionDAO {
  public conn: OracleDB.Connection;
  public connProm;
  public pool;

  constructor() {
    OracleDB.initOracleClient({ libDir: process.env.LIB_DIR || process.env.DOCKER_LIB_DIR  });
    this.createPool();
    this.getConnect();
  }
  async createPool() {
    this.pool = await OracleDB.createPool({
      connectString: process.env.ORACLE_CONNECT,
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PWD,
    }).then(() => {
      console.log('connect to database success');
    }).catch((error) => {
      console.log('connect error', error);
      throw new Error(error.message)
    });
  }
  async getConnect() {
    if(!this.pool) await this.pool;
    this.connProm = await OracleDB.getConnection()
      .then(async connection => {
        console.log('getConnect success');
        this.conn = connection;
      })
      .catch((err: any) => {
        console.error(err.message);
      });
  }
  public transaction(allQuery: Promise<any>[]) {
    try {
      Promise.all(allQuery).then(() => {
        this.conn.commit();
      });
    } catch (error) {
      console.log('transaction', error);
      this.conn.rollback();
    }
  }
  public excuteQuery(query: string, binds?: any, options?: OracleDB.ExecuteOptions): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!this.conn) {
          await this.getConnect();
        }
        console.log('query', query);
        let result = await this.conn.execute(query, binds || [], {autoCommit: true, ...options});
        resolve(result);
      } catch (err) {
        // catches errors in getConnection and the query
        console.log('[Error] happened? - calling reject', err);
        reject(err);
      } 
    });
  }
}

const oracleConnect = new ConnectionDAO();
export default oracleConnect;
