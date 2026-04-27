"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customerController_1 = require("../controllers/customerController");
const validateCustomer_1 = require("../middleware/validateCustomer");
// Router maps URL paths to the request pipeline:
// route -> validation middleware -> controller -> model/database.
const router = (0, express_1.Router)();
// Create flow: validate body first, then controller persists via model.
router.post("/customers", validateCustomer_1.validateCustomerInput, customerController_1.createCustomerHandler);
// Read all customers (no body/path validation required).
router.get("/customers", customerController_1.getAllCustomersHandler);
// Read one customer by id; id is validated before controller executes.
router.get("/customers/:id", validateCustomer_1.validateCustomerIdParam, customerController_1.getCustomerByIdHandler);
// Update flow: validate id + payload before updating in model layer.
router.put("/customers/:id", validateCustomer_1.validateCustomerIdParam, validateCustomer_1.validateCustomerInput, customerController_1.updateCustomerHandler);
// Delete flow: validate id then attempt deletion.
router.delete("/customers/:id", validateCustomer_1.validateCustomerIdParam, customerController_1.deleteCustomerHandler);
exports.default = router;
