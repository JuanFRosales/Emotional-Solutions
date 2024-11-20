import mysql from 'mysql2/promise';
import dotenv from 'dotenv';


dotenv.config();


const connectionUrl = process.env.DB_URL;

if (!connectionUrl) {
  throw new Error('DB_URL environment variable is not defined');
}


const pool = mysql.createPool(connectionUrl);

export default pool;
