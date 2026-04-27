import { NextFunction, Request, Response } from "express";

// Handles unmatched routes after all routers have been evaluated.
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

// Centralized fallback error handler for unhandled exceptions in the request pipeline.
export const globalErrorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Log detailed server-side context while returning a safe client message.
  console.error("Unhandled server error:", error);
  res.status(500).json({ message: "An unexpected server error occurred." });
};
