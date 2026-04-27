import express from "express";
import customerRoutes from "./routes/customerRoutes";
import { globalErrorHandler, notFoundHandler } from "./middleware/errorHandler";

// Express app is exported separately so tests can import it without opening a network port.
const app = express();

// Parse incoming JSON body before routes/middleware read req.body.
app.use(express.json());

// Lightweight health probe to confirm the API process is alive.
app.get("/health", (_req, res) => {
  res.status(200).json({ message: "API is running." });
});

// Route entrypoint: forwards /api/* requests to the customer router.
app.use("/api", customerRoutes);

// If no route matched above, return a standardized 404.
app.use(notFoundHandler);
// Final safety net for uncaught errors thrown in previous layers.
app.use(globalErrorHandler);

export default app;
