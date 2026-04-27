"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCustomerById = exports.updateCustomerById = exports.getCustomerById = exports.getAllCustomers = exports.createCustomer = void 0;
const db_1 = __importDefault(require("../config/db"));
// DAL function: inserts a customer and returns the generated primary key.
const createCustomer = async (payload) => {
    const [result] = await db_1.default.execute(`INSERT INTO customers (first_name, last_name, age, date_of_birth)
     VALUES (?, ?, ?, ?)`, [payload.first_name, payload.last_name, payload.age, payload.date_of_birth]);
    return result.insertId;
};
exports.createCustomer = createCustomer;
// DAL function: fetches every customer; controller decides response semantics.
const getAllCustomers = async () => {
    const [rows] = await db_1.default.execute("SELECT * FROM customers ORDER BY id ASC");
    return rows;
};
exports.getAllCustomers = getAllCustomers;
// DAL function: fetches one customer by id and returns null when absent.
const getCustomerById = async (id) => {
    const [rows] = await db_1.default.execute("SELECT * FROM customers WHERE id = ?", [id]);
    if (rows.length === 0) {
        return null;
    }
    return rows[0];
};
exports.getCustomerById = getCustomerById;
// DAL function: updates a row and reports success via affected row count.
const updateCustomerById = async (id, payload) => {
    const [result] = await db_1.default.execute(`UPDATE customers
     SET first_name = ?, last_name = ?, age = ?, date_of_birth = ?
     WHERE id = ?`, [payload.first_name, payload.last_name, payload.age, payload.date_of_birth, id]);
    return result.affectedRows > 0;
};
exports.updateCustomerById = updateCustomerById;
// DAL function: deletes by id and reports whether a row existed.
const deleteCustomerById = async (id) => {
    const [result] = await db_1.default.execute("DELETE FROM customers WHERE id = ?", [id]);
    return result.affectedRows > 0;
};
exports.deleteCustomerById = deleteCustomerById;
