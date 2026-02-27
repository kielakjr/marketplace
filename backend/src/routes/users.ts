import { Router } from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/users";
import { requireAuth, requireAdmin } from "../middleware/auth";

const router = Router();


router.get("/", requireAuth, requireAdmin, getUsers);
router.get("/:id", requireAuth, getUserById);
router.post("/", requireAuth, requireAdmin, createUser);
router.put("/:id", requireAuth, updateUser);
router.delete("/:id", requireAuth, requireAdmin, deleteUser);

export default router;
