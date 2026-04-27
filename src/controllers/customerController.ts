import { Request, Response } from "express";
import {
  createCustomer,
  deleteCustomerById,
  getAllCustomers,
  getCustomerById,
  updateCustomerById
} from "../models/customerModel";

// Controller layer coordinates HTTP concerns:
// - Reads req params/body
// - Calls model functions
// - Converts outcomes into HTTP status + JSON responses.
export const createCustomerHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    // Model inserts the record and returns the generated database id.
    const newId = await createCustomer(req.body);
    // Fetch the created record to return canonical persisted data.
    const createdCustomer = await getCustomerById(newId);

    res.status(201).json({
      message: "Customer created successfully.",
      data: createdCustomer
    });
  } catch (error) {
    console.error("Create customer failed:", error);
    res.status(500).json({ message: "Internal server error while creating customer." });
  }
};

export const getAllCustomersHandler = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Delegate full data retrieval to model (DAL).
    const customers = await getAllCustomers();
    res.status(200).json({ data: customers });
  } catch (error) {
    console.error("Get all customers failed:", error);
    res.status(500).json({ message: "Internal server error while fetching customers." });
  }
};

export const getCustomerByIdHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    // ID already validated in middleware; conversion from string remains necessary.
    const customerId = Number(req.params.id);
    const customer = await getCustomerById(customerId);

    // Controller translates "not found" model result into 404 HTTP semantics.
    if (!customer) {
      res.status(404).json({ message: "Customer not found." });
      return;
    }

    res.status(200).json({ data: customer });
  } catch (error) {
    console.error("Get customer by id failed:", error);
    res.status(500).json({ message: "Internal server error while fetching customer." });
  }
};

export const updateCustomerHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const customerId = Number(req.params.id);
    // Model returns whether an existing row was actually updated.
    const wasUpdated = await updateCustomerById(customerId, req.body);

    if (!wasUpdated) {
      res.status(404).json({ message: "Customer not found." });
      return;
    }

    // Read back the updated record to return the latest database state.
    const updatedCustomer = await getCustomerById(customerId);

    res.status(200).json({
      message: "Customer updated successfully.",
      data: updatedCustomer
    });
  } catch (error) {
    console.error("Update customer failed:", error);
    res.status(500).json({ message: "Internal server error while updating customer." });
  }
};

export const deleteCustomerHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const customerId = Number(req.params.id);
    // Delete result indicates whether a row matched this id.
    const wasDeleted = await deleteCustomerById(customerId);

    if (!wasDeleted) {
      res.status(404).json({ message: "Customer not found." });
      return;
    }

    res.status(200).json({ message: "Customer deleted successfully." });
  } catch (error) {
    console.error("Delete customer failed:", error);
    res.status(500).json({ message: "Internal server error while deleting customer." });
  }
};
