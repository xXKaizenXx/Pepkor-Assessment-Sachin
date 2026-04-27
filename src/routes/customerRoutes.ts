import { Router } from "express";
import {
  createCustomerHandler,
  deleteCustomerHandler,
  getAllCustomersHandler,
  getCustomerByIdHandler,
  updateCustomerHandler
} from "../controllers/customerController";
import { validateCustomerIdParam, validateCustomerInput } from "../middleware/validateCustomer";

// Router maps URL paths to the request pipeline:
// route -> validation middleware -> controller -> model/database.
const router = Router();

// Create flow: validate body first, then controller persists via model.
router.post("/customers", validateCustomerInput, createCustomerHandler);
// Read all customers (no body/path validation required).
router.get("/customers", getAllCustomersHandler);
// Read one customer by id; id is validated before controller executes.
router.get("/customers/:id", validateCustomerIdParam, getCustomerByIdHandler);
// Update flow: validate id + payload before updating in model layer.
router.put("/customers/:id", validateCustomerIdParam, validateCustomerInput, updateCustomerHandler);
// Delete flow: validate id then attempt deletion.
router.delete("/customers/:id", validateCustomerIdParam, deleteCustomerHandler);

export default router;
