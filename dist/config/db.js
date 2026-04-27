"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load .env once so DB credentials are available to the connection pool setup.
dotenv_1.default.config();
// Required variables keep configuration explicit and prevent silent misconfiguration.
const requiredEnvVars = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"];
requiredEnvVars.forEach((name) => {
    if (!process.env[name]) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
});
// Shared MySQL connection pool used by model functions for all database operations.
const pool = promise_1.default.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
// Export one pool instance so the app reuses connections efficiently.
exports.default = pool;
