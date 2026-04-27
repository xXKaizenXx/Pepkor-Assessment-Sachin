"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const customerRoutes_1 = __importDefault(require("./routes/customerRoutes"));
const errorHandler_1 = require("./middleware/errorHandler");
// Express app is exported separately so tests can import it without opening a network port.
const app = (0, express_1.default)();
// Parse incoming JSON body before routes/middleware read req.body.
app.use(express_1.default.json());
// Lightweight health probe to confirm the API process is alive.
app.get("/health", (_req, res) => {
    res.status(200).json({ message: "API is running." });
});
// Route entrypoint: forwards /api/* requests to the customer router.
app.use("/api", customerRoutes_1.default);
// If no route matched above, return a standardized 404.
app.use(errorHandler_1.notFoundHandler);
// Final safety net for uncaught errors thrown in previous layers.
app.use(errorHandler_1.globalErrorHandler);
exports.default = app;
