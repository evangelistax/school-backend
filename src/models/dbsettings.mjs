import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  port: 3306,
  password: "lasalledelea",
  database: "school",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
