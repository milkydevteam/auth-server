const mongoose = require('mongoose');
const oracledb = require('oracledb');
require('mongoose-long')(mongoose);

const { MONGODB_URI } = process.env;

mongoose.connect(MONGODB_URI, {
  autoIndex: false,
  useNewUrlParser: true,
  useFindAndModify: false,
});

mongoose.connection.on('error', err => {
  console.error(err);
  process.exit();
});

mongoose.connection.once('open', () => {
  console.log(`Connected to MongoDB: ${MONGODB_URI}`);
});
import * as OracleDB from 'oracledb';

export class ConnectionDAO {
  /**
   * Connection Variable Declaration
   */
  public conn: OracleDB.IConnection;
  public connProm: OracleDB.IPromise<void>;

  /**
   * Result Variable Declaration
   */
  result;

  /**
   *
   * Creates an instance of CommercialDAO.
   * To Initiate Connection and Make the connection utilized by @memberof CommercialDAO
   * @memberof CommercialDAO
   */
  constructor() {
    oracledb.initOracleClient({ libDir: '/Users/milky/instantclient_19_3' });

    this.connProm = oracledb
      .getConnection({
        connectString: process.env.ORACLE_CONNECT,
        user: process.env.ORACLE_USER,
        password: process.env.ORACLE_PWD,
      })
      .then(async (connection: OracleDB.IConnection) => {
        console.log('Connection finally created in constructor');
        this.conn = connection;
      })
      .catch((err: any) => {
        console.error(err.message);
      });
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
