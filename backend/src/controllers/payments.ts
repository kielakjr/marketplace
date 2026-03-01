import { Request, Response } from "express";
import { PaymentService } from "../services/payment";
import { updatePaymentSchema } from "../validation/payment";

export async function processPayment(req: Request<{ orderId: string }>, res: Response) {
  try {
    const payment = await PaymentService.processPayment(
      req.params.orderId,
      req.user!.userId,
      req.body.payment_gateway_id
    );
    res.json(payment);
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes("not found")) return res.status(404).json({ error: error.message });
      if (error.message.includes("already")) return res.status(400).json({ error: error.message });
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to process payment" });
  }
}

export async function updatePaymentStatus(req: Request<{ id: string }>, res: Response) {
  try {
    const validated = updatePaymentSchema.parse(req.body);
    const payment = await PaymentService.updateStatus(req.params.id, validated.status, validated.payment_gateway_id);
    res.json(payment);
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "Payment not found") return res.status(404).json({ error: error.message });
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to update payment" });
  }
}
