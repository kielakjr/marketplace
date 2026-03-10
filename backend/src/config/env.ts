import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: process.env.PORT || "5001",
  DATABASE_URL: process.env.DATABASE_URL as string,

  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_EXPIRES_IN: (process.env.JWT_EXPIRES_IN || "7d") as `${number}${"s" | "m" | "h" | "d"}`,

  COOKIE_NAME: "marketplace_token",
  CSRF_COOKIE_NAME: "marketplace_csrf",
  COOKIE_MAX_AGE: 7 * 24 * 60 * 60 * 1000,

  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",

  NODE_ENV: process.env.NODE_ENV || "development",

  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET as string,
  AWS_S3_REGION: process.env.AWS_S3_REGION || "eu-central-1",
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID as string,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY as string,
  S3_UPLOAD_MAX_SIZE_MB: parseInt(process.env.S3_UPLOAD_MAX_SIZE_MB || "5"),

  SMTP_HOST: process.env.SMTP_HOST as string,
  SMTP_PORT: parseInt(process.env.SMTP_PORT || "587"),
  SMTP_USER: process.env.SMTP_USER as string,
  SMTP_PASS: process.env.SMTP_PASS as string,
  SMTP_FROM: process.env.SMTP_FROM || "noreply@marketplace.com",
};
