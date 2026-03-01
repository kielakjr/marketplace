import { Router } from "express";
import {
  getProducts,
  getProductById,
  getUserProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/products";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/", getProducts);
router.get("/user/:userId", getUserProducts);
router.get("/:id", getProductById);

router.post("/", requireAuth, createProduct);
router.put("/:id", requireAuth, updateProduct);
router.delete("/:id", requireAuth, deleteProduct);

export default router;
