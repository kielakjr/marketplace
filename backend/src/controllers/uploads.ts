import { Request, Response } from "express";
import { ZodError } from "zod";
import { S3Service } from "../services/s3";
import { uploadUrlSchema } from "../validation/uploads";

export async function getUploadUrl(req: Request, res: Response) {
  try {
    const validated = uploadUrlSchema.parse(req.body);
    const result = await S3Service.generateUploadUrl(
      req.user!.userId,
      validated.fileType,
      validated.fileSize
    );
    res.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to generate upload URL" });
  }
}
