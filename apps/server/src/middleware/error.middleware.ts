import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api-error.js";

export function errorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  let error = err;

  // If the error is not an instance of ApiError, wrap it
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || error.status || 500;
    const message = error.message || "Internal Server Error";
    error = new ApiError(statusCode, message, error.errors || [], err.stack);
  }

  const isDev = process.env.NODE_ENV !== "production";

  // Log error details for the server logs
  if (error.statusCode >= 500) {
    console.error("Server Error [500]:", error);
  } else {
    console.warn(`Client Error [${error.statusCode}]:`, error.message);
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    ...(error.errors && error.errors.length > 0 ? { errors: error.errors } : {}),
    ...(isDev ? { stack: error.stack } : {}),
  });
}
