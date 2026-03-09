import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(5000).optional(),
  price: z.number().positive(),
  quantity_available: z.number().int().min(0),
  category_id: z.number().int().positive(),
  image_urls: z.array(z.string().url()).max(8).optional(),
});

export const updateProductSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(5000).optional(),
  price: z.number().positive().optional(),
  quantity_available: z.number().int().min(0).optional(),
  category_id: z.number().int().positive().optional(),
  image_urls: z.array(z.string().url()).max(8).optional(),
});

export type ProductCreationAttributes = z.infer<typeof createProductSchema>;
export type ProductUpdateAttributes = z.infer<typeof updateProductSchema>;
