import mysql, { Pool, PoolConnection } from "mysql2";
import dotenv from "dotenv";

dotenv.config({ path: `${__dirname}/../../.env.local` });

const pool: Pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
});

const getConnection = async (): Promise<PoolConnection> => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      } else {
        resolve(connection);
      }
    });
  });
};

const releaseConnection = (connection: PoolConnection): void => {
  connection.release();
};

export { getConnection, releaseConnection };
