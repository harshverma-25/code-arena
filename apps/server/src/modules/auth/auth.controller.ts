import type { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service.js";
import { ApiError } from "../../utils/api-error.js";

export class AuthController {
  /** Health check endpoint */
  healthCheck = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dbHealth = await authService.getHealth();
      res.status(200).json({ success: true, message: "Auth module is online and operational", data: dbHealth });
    } catch (err) {
      next(err);
    }
  };

  /** Sign‑up – creates a new user and returns a short payload */
  signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, username, password } = req.body as { email: string; username: string; password: string };
      const { user, accessToken, refreshToken } = await authService.signup(email, username, password);
      
      authService.setRefreshCookie(res, refreshToken);
      res.status(201).json({ success: true, user, accessToken });
    } catch (err) {
      next(err);
    }
  };

  /** Login – validates credentials and returns tokens */
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body as { email: string; password: string };
      const { user, accessToken, refreshToken } = await authService.login(email, password);
      
      authService.setRefreshCookie(res, refreshToken);
      res.status(200).json({ success: true, user, accessToken });
    } catch (err) {
      next(err);
    }
  };

  /** Refresh – issues a new pair of tokens using the refresh cookie */
  refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        throw new ApiError(401, "Refresh token missing");
      }
      const { accessToken, refreshToken: newRefresh } = await authService.refreshTokens(refreshToken);
      authService.setRefreshCookie(res, newRefresh);
      res.status(200).json({ success: true, accessToken });
    } catch (err) {
      next(err);
    }
  };

  /** Protected test endpoint – reachable only with a valid access token */
  testProtected = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.userId;
      if (!userId) {
        throw new ApiError(401, "Unauthorized");
      }
      res.status(200).json({ success: true, message: "You are authorized", userId });
    } catch (err) {
      next(err);
    }
  };
}

export const authController = new AuthController();
