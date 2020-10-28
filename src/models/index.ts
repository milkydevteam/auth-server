import * as OracleDB from 'oracledb';
// @ts-ignore
OracleDB.outFormat = OracleDB.OUT_FORMAT_OBJECT;
export class ConnectionDAO {
  public conn: OracleDB.Connection;
  public connProm;

  constructor() {
    OracleDB.initOracleClient({ libDir: process.env.LIB_DIR || process.env.DOCKER_LIB_DIR  });

    this.connProm = OracleDB.getConnection({
      connectString: process.env.ORACLE_CONNECT,
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PWD,
    })
      .then(async connection => {
        console.log('Connection to database success');
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
  public excuteQuery(query: string, autoCommit = true): Promise<any[]> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!this.conn) {
          await this.connProm;
        }
        console.log('query', query);
        let result = await this.conn.execute(query, [], { autoCommit });
        resolve(result.rows);
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
