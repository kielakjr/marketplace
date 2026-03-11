import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";

const CSRF_HEADER = "x-csrf-token";
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

const EXEMPT_PATHS = new Set(["/auth/login", "/auth/register", "/auth/forgot-password", "/auth/reset-password", "/payments/webhook"]);

export function verifyCsrf(req: Request, res: Response, next: NextFunction): void {
  if (SAFE_METHODS.has(req.method) || EXEMPT_PATHS.has(req.path)) {
    next();
    return;
  }

  const cookieToken = req.cookies[env.CSRF_COOKIE_NAME];
  const headerToken = req.get(CSRF_HEADER);

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    res.status(403).json({ error: "Invalid CSRF token" });
    return;
  }

  next();
}
