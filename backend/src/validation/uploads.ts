import { z } from "zod";

export const uploadUrlSchema = z.object({
  fileType: z.enum(["image/jpeg", "image/png", "image/webp", "image/gif"]),
  fileSize: z.number().int().positive().max(5 * 1024 * 1024),
});
