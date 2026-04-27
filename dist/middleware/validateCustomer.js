"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCustomerIdParam = exports.validateCustomerInput = void 0;
// Small helper used by request validation middleware to verify date strings.
const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return !Number.isNaN(date.getTime());
};
const validateCustomerInput = (req, res, next) => {
    // Early-exit guard: reject malformed payloads before controller/model logic runs.
    if (req.body === undefined || req.body === null || typeof req.body !== "object") {
        res.status(400).json({
            message: "Request body must be a valid JSON object."
        });
        return;
    }
    // Extract the expected contract used by both controllers and model payloads.
    const { first_name, last_name, age, date_of_birth } = req.body;
    // Validate required text fields and block empty names.
    if (typeof first_name !== "string" ||
        first_name.trim().length === 0 ||
        typeof last_name !== "string" ||
        last_name.trim().length === 0) {
        res.status(400).json({
            message: "first_name and last_name are required and cannot be empty."
        });
        return;
    }
    // Validate numeric domain constraints before touching the database.
    if (typeof age !== "number" || !Number.isInteger(age) || age < 0 || age > 130) {
        res.status(400).json({
            message: "age must be a valid integer between 0 and 130."
        });
        return;
    }
    // Ensure date formatting is usable for downstream SQL persistence.
    if (typeof date_of_birth !== "string" || !isValidDate(date_of_birth)) {
        res.status(400).json({
            message: "date_of_birth must be a valid date string."
        });
        return;
    }
    // Normalize values so downstream layers receive clean, consistent data.
    req.body.first_name = first_name.trim();
    req.body.last_name = last_name.trim();
    // Continue request flow to the mapped controller in routes.
    next();
};
exports.validateCustomerInput = validateCustomerInput;
const validateCustomerIdParam = (req, res, next) => {
    // Route params are strings; convert and validate before controller usage.
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({ message: "id must be a positive integer." });
        return;
    }
    // Param is valid, continue pipeline.
    next();
};
exports.validateCustomerIdParam = validateCustomerIdParam;
