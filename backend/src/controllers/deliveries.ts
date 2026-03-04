import { Request, Response } from "express";
import { DeliveryService } from "../services/delivery";
import { updateDeliverySchema } from "../validation/delivery";

export async function getDeliveryByOrder(req: Request<{ orderId: string }>, res: Response) {
  try {
    const delivery = await DeliveryService.getByOrderId(req.params.orderId, req.user!.userId);
    res.json(delivery);
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes("not found")) return res.status(404).json({ error: error.message });
      return res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to fetch delivery" });
  }
}

export async function updateDelivery(req: Request<{ id: string }>, res: Response) {
  try {
    const validated = updateDeliverySchema.parse(req.body);
    const delivery = await DeliveryService.update(req.params.id, validated);
    res.json(delivery);
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "Delivery not found") return res.status(404).json({ error: error.message });
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to update delivery" });
  }
}

export async function markDeliveryAsSent(req: Request<{ id: string }>, res: Response) {
  try {
    const delivery = await DeliveryService.markAsSent(req.params.id, req.user!.userId);
    res.json(delivery);
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "Delivery not found") return res.status(404).json({ error: error.message });
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to mark delivery as sent" });
  }
}
