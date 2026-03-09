import { Router } from "express";
import { registerUser, loginUser, logoutUser, getMe } from "../controllers/auth";
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

router.get("/me", requireAuth, getMe);

export default router;
