import { Router } from "express";
import { registerUser, loginUser, logoutUser, getMe } from "../controllers/auth";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.get("/me", requireAuth, getMe);

export default router;
