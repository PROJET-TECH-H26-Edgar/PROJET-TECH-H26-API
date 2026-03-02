import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

const connection = mysql.createPool({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "root",
  database: "distributeurCle",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const db = drizzle(connection, { schema, mode: "default" });

export const testConnection = async (): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    await connection.query("SELECT 1");
    console.log("Database connection successful");
    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown database error";
    console.error("Database connection failed:", errorMessage);
    return { success: false, error: errorMessage };
  }
};
