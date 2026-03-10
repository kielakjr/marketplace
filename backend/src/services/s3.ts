import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { env } from "../config/env";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;
type AllowedType = (typeof ALLOWED_TYPES)[number];

const EXTENSION_MAP: Record<AllowedType, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const s3Client = new S3Client({
  region: env.AWS_S3_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

export class S3Service {
  static isAllowedType(fileType: string): fileType is AllowedType {
    return ALLOWED_TYPES.includes(fileType as AllowedType);
  }

  static async generateUploadUrl(
    userId: string,
    fileType: string,
    fileSize: number
  ): Promise<{ uploadUrl: string; publicUrl: string }> {
    if (!this.isAllowedType(fileType)) {
      throw new Error(`Invalid file type. Allowed: ${ALLOWED_TYPES.join(", ")}`);
    }

    const maxBytes = env.S3_UPLOAD_MAX_SIZE_MB * 1024 * 1024;
    if (fileSize > maxBytes) {
      throw new Error(`File too large. Max size: ${env.S3_UPLOAD_MAX_SIZE_MB}MB`);
    }

    const ext = EXTENSION_MAP[fileType];
    const key = `products/${userId}/${randomUUID()}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: env.AWS_S3_BUCKET,
      Key: key,
      ContentType: fileType,
      ContentLength: fileSize,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });
    const publicUrl = `https://${env.AWS_S3_BUCKET}.s3.${env.AWS_S3_REGION}.amazonaws.com/${key}`;

    return { uploadUrl, publicUrl };
  }
}
