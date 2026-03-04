import { Router } from "express";
import { getDeliveryByOrder, updateDelivery, markDeliveryAsSent } from "../controllers/deliveries";
import { requireAuth, requireAdmin } from "../middleware/auth";

const router = Router();

router.use(requireAuth);

router.get("/orders/:orderId", getDeliveryByOrder);

router.patch("/:id", requireAdmin, updateDelivery);
router.patch("/:id/sent", markDeliveryAsSent);
export default router;
