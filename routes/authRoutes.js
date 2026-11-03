import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { loginRateLimiter, signupRateLimiter } from "../middleware/rateLimiter.js";
import { signup, login, logout, getProfile } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signupRateLimiter, signup);
router.post("/login", loginRateLimiter, login);
router.post("/logout", authMiddleware, logout);
router.get("/profile", authMiddleware, getProfile);

export default router;
