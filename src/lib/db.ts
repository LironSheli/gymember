import mysql from "mysql2/promise";

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "gymember",
  port: parseInt(process.env.DB_PORT || "3306"),
};

export async function createConnection() {
  return await mysql.createConnection(dbConfig);
}

export async function query(sql: string, params?: any[]) {
  const connection = await createConnection();
  try {
    const [results] = await connection.execute(sql, params);
    return results;
  } finally {
    await connection.end();
  }
}
