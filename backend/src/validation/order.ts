import { z } from "zod";

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        product_id: z.string().uuid("Invalid product ID"),
        quantity: z.number().int().min(1, "Quantity must be at least 1"),
      })
    )
    .min(1, "Order must contain at least one item"),
  address_details: z.string().min(5, "Address must be at least 5 characters"),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "COMPLETED", "CANCELLED"]),
});
