import { Router } from "express";
import { processPayment, updatePaymentStatus, createPaymentIntent } from "../controllers/payments";
import { requireAuth, requireAdmin } from "../middleware/auth";

const router = Router();

router.use(requireAuth);

router.post("/orders/:orderId/pay", processPayment);
router.post("/orders/:orderId/create-intent", createPaymentIntent);

router.patch("/:id/status", requireAdmin, updatePaymentStatus);

export default router;
