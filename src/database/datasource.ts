import * as fs from 'fs';
import { Connection, getConnection, initOracleClient } from 'oracledb';
import dbConfig from '../config/db.config';

let libDir;
if (process.platform === 'win32') {
  libDir = `${process.env.HOMEDRIVE}\\Oracle\\instantclient_21_7'`;
} else if (process.platform === 'darwin') {
  libDir = `${process.env.HOME}/Downloads/instantclient_19_8`;
}
console.log(libDir, dbConfig);
if (libDir && fs.existsSync(libDir)) {
  initOracleClient({ libDir });
}

export const connect = async (): Promise<Connection | undefined> => {
  try {
    const connection = await getConnection(dbConfig);

    console.log('Database connection successful!');

    return connection;
  } catch (error) {
    console.log(error);
  }
};

export const disconnect = async (connection: Connection | undefined) => {
  if (connection) {
    try {
      await connection.close()
    } catch (error) {
      console.log(error);
    }
  }
};

export const execute = async (query: string, binds: any = {}, options: any = { extendedMetaData: true }): Promise<any> => {
  const connection = await connect();
  try {
    return connection?.execute(query, binds, options);
  } catch (error) {
    console.log(error);
  } finally {
    await disconnect(connection);
  }
}
