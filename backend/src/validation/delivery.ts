import { z } from "zod";

export const updateDeliverySchema = z.object({
  status: z.enum(["PREPARING", "SHIPPED", "IN_TRANSIT", "DELIVERED", "FAILED_DELIVERY"]).optional(),
  tracking_number: z.string().max(100).optional(),
});
