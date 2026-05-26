import prisma from "../../config/prisma.js";
import bcrypt from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import type { Response } from "express";
import { ApiError } from "../../utils/api-error.js";

// Types for token payloads
interface AccessTokenPayload {
  userId: string;
}
interface RefreshTokenPayload extends AccessTokenPayload {}

export class AuthService {
  /** Health check – unchanged */
  async getHealth() {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return { status: "UP", database: "connected", timestamp: new Date().toISOString() };
    } catch (error: any) {
      return {
        status: "DEGRADED",
        database: "disconnected",
        error: error.message ?? String(error),
        timestamp: new Date().toISOString(),
      };
    }
  }

  /** Create a new user and generate tokens */
  async signup(email: string, username: string, password: string) {
    if (!email || !username || !password) {
      throw new ApiError(400, "All fields (email, username, password) are required");
    }

    // Check for existing email / username
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
    if (existing) {
      throw new ApiError(409, "User with given email or username already exists");
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, username, password: hashed },
      select: { id: true, email: true, username: true },
    });

    // Generate tokens inside service layer
    const accessToken = this.generateAccessToken(user.id);
    const refreshToken = this.generateRefreshToken(user.id);

    return { user, accessToken, refreshToken };
  }

  /** Verify credentials and return user + tokens */
  async login(email: string, password: string) {
    if (!email || !password) {
      throw new ApiError(400, "Email and password are required");
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new ApiError(401, "Invalid email or password");
    }
    // Generate tokens
    const accessToken = this.generateAccessToken(user.id);
    const refreshToken = this.generateRefreshToken(user.id);
    return { user: { id: user.id, email: user.email, username: user.username }, accessToken, refreshToken };
  }

  /** Create a new access token */
  generateAccessToken(userId: string): string {
    const payload: AccessTokenPayload = { userId };
    const secret = process.env.JWT_ACCESS_SECRET as string;
    const expiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN || "15m";
    return sign(payload, secret, { expiresIn: expiresIn as any }) as string;
  }

  /** Create a new refresh token */
  generateRefreshToken(userId: string): string {
    const payload: RefreshTokenPayload = { userId };
    const secret = process.env.JWT_REFRESH_SECRET as string;
    const expiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";
    return sign(payload, secret, { expiresIn: expiresIn as any }) as string;
  }

  /** Set HTTP‑only refresh cookie on response */
  setRefreshCookie(res: Response, token: string) {
    const isProd = process.env.NODE_ENV === "production";
    res.cookie("refreshToken", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax", // flexible sameSite for local dev/cors, strict or none for prod
      path: "/api/auth/refresh",
      maxAge: Number(process.env.REFRESH_COOKIE_MAX_AGE) || 7 * 24 * 60 * 60 * 1000, // 7 days default
    });
  }

  /** Verify refresh token and issue new pair */
  async refreshTokens(refreshToken: string) {
    const secret = process.env.JWT_REFRESH_SECRET as string;
    try {
      const decoded = verify(refreshToken, secret) as RefreshTokenPayload;
      const newAccess = this.generateAccessToken(decoded.userId);
      const newRefresh = this.generateRefreshToken(decoded.userId);
      return { accessToken: newAccess, refreshToken: newRefresh };
    } catch (err) {
      throw new ApiError(401, "Invalid refresh token");
    }
  }
}

export const authService = new AuthService();
