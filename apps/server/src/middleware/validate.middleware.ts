import type { Request, Response, NextFunction } from "express";
import { ZodError, type ZodTypeAny } from "zod";
import { ApiError } from "../utils/api-error.js";

/**
 * Reusable Express middleware to validate request payload against a Zod schema.
 * Validates body, query, and params, and strips unexpected inputs.
 */
export const validateRequest = (schema: ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = (await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      })) as any;

      // Replace with validated/sanitized input
      req.body = parsed.body;
      req.query = parsed.query;
      req.params = parsed.params;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((err) => ({
          // err.path has "body", "query" or "params" as first element, remove it for user-facing field name
          field: err.path.slice(1).join("."),
          message: err.message,
        }));
        return next(new ApiError(400, "Validation Failed", formattedErrors));
      }
      next(error);
    }
  };
};
