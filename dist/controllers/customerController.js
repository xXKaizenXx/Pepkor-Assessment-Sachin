"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCustomerHandler = exports.updateCustomerHandler = exports.getCustomerByIdHandler = exports.getAllCustomersHandler = exports.createCustomerHandler = void 0;
const customerModel_1 = require("../models/customerModel");
// Controller layer coordinates HTTP concerns:
// - Reads req params/body
// - Calls model functions
// - Converts outcomes into HTTP status + JSON responses.
const createCustomerHandler = async (req, res) => {
    try {
        // Model inserts the record and returns the generated database id.
        const newId = await (0, customerModel_1.createCustomer)(req.body);
        // Fetch the created record to return canonical persisted data.
        const createdCustomer = await (0, customerModel_1.getCustomerById)(newId);
        res.status(201).json({
            message: "Customer created successfully.",
            data: createdCustomer
        });
    }
    catch (error) {
        console.error("Create customer failed:", error);
        res.status(500).json({ message: "Internal server error while creating customer." });
    }
};
exports.createCustomerHandler = createCustomerHandler;
const getAllCustomersHandler = async (_req, res) => {
    try {
        // Delegate full data retrieval to model (DAL).
        const customers = await (0, customerModel_1.getAllCustomers)();
        res.status(200).json({ data: customers });
    }
    catch (error) {
        console.error("Get all customers failed:", error);
        res.status(500).json({ message: "Internal server error while fetching customers." });
    }
};
exports.getAllCustomersHandler = getAllCustomersHandler;
const getCustomerByIdHandler = async (req, res) => {
    try {
        // ID already validated in middleware; conversion from string remains necessary.
        const customerId = Number(req.params.id);
        const customer = await (0, customerModel_1.getCustomerById)(customerId);
        // Controller translates "not found" model result into 404 HTTP semantics.
        if (!customer) {
            res.status(404).json({ message: "Customer not found." });
            return;
        }
        res.status(200).json({ data: customer });
    }
    catch (error) {
        console.error("Get customer by id failed:", error);
        res.status(500).json({ message: "Internal server error while fetching customer." });
    }
};
exports.getCustomerByIdHandler = getCustomerByIdHandler;
const updateCustomerHandler = async (req, res) => {
    try {
        const customerId = Number(req.params.id);
        // Model returns whether an existing row was actually updated.
        const wasUpdated = await (0, customerModel_1.updateCustomerById)(customerId, req.body);
        if (!wasUpdated) {
            res.status(404).json({ message: "Customer not found." });
            return;
        }
        // Read back the updated record to return the latest database state.
        const updatedCustomer = await (0, customerModel_1.getCustomerById)(customerId);
        res.status(200).json({
            message: "Customer updated successfully.",
            data: updatedCustomer
        });
    }
    catch (error) {
        console.error("Update customer failed:", error);
        res.status(500).json({ message: "Internal server error while updating customer." });
    }
};
exports.updateCustomerHandler = updateCustomerHandler;
const deleteCustomerHandler = async (req, res) => {
    try {
        const customerId = Number(req.params.id);
        // Delete result indicates whether a row matched this id.
        const wasDeleted = await (0, customerModel_1.deleteCustomerById)(customerId);
        if (!wasDeleted) {
            res.status(404).json({ message: "Customer not found." });
            return;
        }
        res.status(200).json({ message: "Customer deleted successfully." });
    }
    catch (error) {
        console.error("Delete customer failed:", error);
        res.status(500).json({ message: "Internal server error while deleting customer." });
    }
};
exports.deleteCustomerHandler = deleteCustomerHandler;
