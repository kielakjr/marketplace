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
  address: z.object({
    street: z.string().min(1, "Street is required"),
    street_number: z.string().min(1, "Street number is required"),
    city: z.string().min(1, "City is required"),
    postal_code: z.string().min(1, "Postal code is required"),
  }),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "COMPLETED", "CANCELLED"]),
});
