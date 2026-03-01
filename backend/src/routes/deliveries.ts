import { Router } from "express";
import { getDeliveryByOrder, updateDelivery } from "../controllers/deliveries";
import { requireAuth, requireAdmin } from "../middleware/auth";

const router = Router();

router.use(requireAuth);

router.get("/orders/:orderId", getDeliveryByOrder);

router.patch("/:id", requireAdmin, updateDelivery);

export default router;
