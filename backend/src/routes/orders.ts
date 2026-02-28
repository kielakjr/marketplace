import { Router } from "express";
import {
  createOrder, getUserOrders, getOrderById, cancelOrder,
  getAllOrders, updateOrderStatus,
} from "../controllers/orders";
import { requireAuth, requireAdmin } from "../middleware/auth";

const router = Router();

router.use(requireAuth);

router.post("/", createOrder);
router.get("/", getUserOrders);
router.get("/:id", getOrderById);
router.patch("/:id/cancel", cancelOrder);

router.get("/admin/all", requireAdmin, getAllOrders);
router.patch("/admin/:id/status", requireAdmin, updateOrderStatus);

export default router;
