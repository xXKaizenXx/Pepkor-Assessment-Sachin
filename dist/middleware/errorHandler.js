"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = exports.notFoundHandler = void 0;
// Handles unmatched routes after all routers have been evaluated.
const notFoundHandler = (req, res) => {
    res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};
exports.notFoundHandler = notFoundHandler;
// Centralized fallback error handler for unhandled exceptions in the request pipeline.
const globalErrorHandler = (error, _req, res, _next) => {
    // Log detailed server-side context while returning a safe client message.
    console.error("Unhandled server error:", error);
    res.status(500).json({ message: "An unexpected server error occurred." });
};
exports.globalErrorHandler = globalErrorHandler;
