import { Router } from "express";
import { getUploadUrl } from "../controllers/uploads";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.post("/presigned-url", requireAuth, getUploadUrl);

export default router;
