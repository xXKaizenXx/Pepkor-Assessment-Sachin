import mysql, { Pool } from "mysql2/promise";
import dotenv from "dotenv";

// Load .env once so DB credentials are available to the connection pool setup.
dotenv.config();

// Required variables keep configuration explicit and prevent silent misconfiguration.
const requiredEnvVars = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"];

requiredEnvVars.forEach((name) => {
  if (!process.env[name]) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
});

// Shared MySQL connection pool used by model functions for all database operations.
const pool: Pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Export one pool instance so the app reuses connections efficiently.
export default pool;
