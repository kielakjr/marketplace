import { Router } from "express";
import {
  createOrder, getUserOrders, getOrderById, cancelOrder,
  getAllOrders, updateOrderStatus, getSellerOrders, getSaleById,
  adminGetOrderById,
} from "../controllers/orders";
import { requireAuth, requireAdmin } from "../middleware/auth";

const router = Router();

router.use(requireAuth);

router.post("/", createOrder);
router.get("/", getUserOrders);

router.get("/seller", getSellerOrders);
router.get("/seller/:id", getSaleById);

router.get("/admin/all", requireAdmin, getAllOrders);
router.patch("/admin/:id/status", requireAdmin, updateOrderStatus);
router.get("/admin/:id", requireAdmin, adminGetOrderById);

router.get("/:id", getOrderById);
router.patch("/:id/cancel", cancelOrder);

export default router;
