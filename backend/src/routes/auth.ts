import { Router } from "express";
import { registerUser, loginUser, logoutUser, getMe, forgotPassword, resetPassword } from "../controllers/auth";
import { requireAuth } from "../middleware/auth";
import rateLimit from "express-rate-limit";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many attempts, try again later' },
});

router.post("/register", authLimiter, registerUser);
router.post("/login", authLimiter, loginUser);
router.post("/logout", authLimiter, logoutUser);
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password", authLimiter, resetPassword);

router.get("/me", requireAuth, getMe);

export default router;
