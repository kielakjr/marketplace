import { Router } from "express";
import { submitRating, getUserRatings } from "../controllers/userRatings";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.post("/submit", requireAuth, submitRating);
router.get("/user/:userId", getUserRatings);

export default router;
