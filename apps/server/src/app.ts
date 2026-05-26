import express from "express";
import type { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./modules/auth/auth.routes.js";

import { errorMiddleware } from "./middleware/error.middleware.js";

const app: Express = express();

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Base Route
app.get("/", (_req: Request, res: Response) => {
  res.send("CodeArena API Running");
});

// Module Routes
app.use("/api/auth", authRouter);

// Global Error Handler Middleware
app.use(errorMiddleware);

export default app;