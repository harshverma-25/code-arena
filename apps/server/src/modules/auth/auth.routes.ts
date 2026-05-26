import { Router } from "express";
import { authController } from "./auth.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router: Router = Router();

// Health‑check
router.get("/health", authController.healthCheck);

// Public auth endpoints
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);

// Protected example route
router.get("/protected", authMiddleware, authController.testProtected);

export default router;
