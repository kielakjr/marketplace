import { z } from "zod";

export const updatePaymentSchema = z.object({
  status: z.enum(["PENDING", "PAID", "FAILED", "REFUNDED"]),
  payment_gateway_id: z.string().optional(),
});
