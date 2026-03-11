import crypto from "crypto";
import { Response } from "express";
import { env } from "../config/env";

export function setTokenCookie(res: Response, token: string): void {
  res.cookie(env.COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: env.COOKIE_MAX_AGE,
    path: "/",
  });
}

export function clearTokenCookie(res: Response): void {
  res.clearCookie(env.COOKIE_NAME, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export function setCsrfCookie(res: Response): void {
  const csrfToken = crypto.randomBytes(32).toString("hex");
  res.cookie(env.CSRF_COOKIE_NAME, csrfToken, {
    httpOnly: false,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: env.COOKIE_MAX_AGE,
    path: "/",
  });
}

export function clearCsrfCookie(res: Response): void {
  res.clearCookie(env.CSRF_COOKIE_NAME, {
    httpOnly: false,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}
