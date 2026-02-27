import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: process.env.PORT || "5000",
  DATABASE_URL: process.env.DATABASE_URL as string,

  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_EXPIRES_IN: (process.env.JWT_EXPIRES_IN || "7d") as `${number}${"s" | "m" | "h" | "d"}`,

  COOKIE_NAME: "marketplace_token",
  COOKIE_MAX_AGE: 7 * 24 * 60 * 60 * 1000,

  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",

  NODE_ENV: process.env.NODE_ENV || "development",
};
