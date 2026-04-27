import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/db";

// Represents the full row shape returned from the customers table.
export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  age: number;
  date_of_birth: string;
  created_at: string;
  updated_at: string;
}

// Represents the writable fields accepted from API payloads.
export interface CustomerPayload {
  first_name: string;
  last_name: string;
  age: number;
  date_of_birth: string;
}

// DAL function: inserts a customer and returns the generated primary key.
export const createCustomer = async (payload: CustomerPayload): Promise<number> => {
  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO customers (first_name, last_name, age, date_of_birth)
     VALUES (?, ?, ?, ?)`,
    [payload.first_name, payload.last_name, payload.age, payload.date_of_birth]
  );

  return result.insertId;
};

// DAL function: fetches every customer; controller decides response semantics.
export const getAllCustomers = async (): Promise<Customer[]> => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    "SELECT * FROM customers ORDER BY id ASC"
  );
  return rows as Customer[];
};

// DAL function: fetches one customer by id and returns null when absent.
export const getCustomerById = async (id: number): Promise<Customer | null> => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    "SELECT * FROM customers WHERE id = ?",
    [id]
  );

  if (rows.length === 0) {
    return null;
  }

  return rows[0] as Customer;
};

// DAL function: updates a row and reports success via affected row count.
export const updateCustomerById = async (
  id: number,
  payload: CustomerPayload
): Promise<boolean> => {
  const [result] = await pool.execute<ResultSetHeader>(
    `UPDATE customers
     SET first_name = ?, last_name = ?, age = ?, date_of_birth = ?
     WHERE id = ?`,
    [payload.first_name, payload.last_name, payload.age, payload.date_of_birth, id]
  );

  return result.affectedRows > 0;
};

// DAL function: deletes by id and reports whether a row existed.
export const deleteCustomerById = async (id: number): Promise<boolean> => {
  const [result] = await pool.execute<ResultSetHeader>(
    "DELETE FROM customers WHERE id = ?",
    [id]
  );

  return result.affectedRows > 0;
};
