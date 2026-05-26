import type { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { ApiError } from "../utils/api-error.js";

/**
 * Middleware that verifies the JWT access token sent via the `Authorization: Bearer <token>` header.
 * On success it attaches `req.userId` (string) for downstream handlers.
 * On failure it passes the error to the global handler.
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "Missing or malformed Authorization header"));
  }
  
  const token = authHeader.split(" ")[1];
  if (!token) {
    return next(new ApiError(401, "Malformed Authorization token"));
  }

  try {
    const secret = process.env.JWT_ACCESS_SECRET as string;
    const payload = verify(token, secret) as { userId: string };
    
    // Attach the user id to the request for downstream use (express.d.ts adds this to type definition)
    req.userId = payload.userId;
    next();
  } catch (err) {
    next(new ApiError(401, "Invalid or expired token"));
  }
}

