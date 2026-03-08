import { Request, Response, NextFunction } from "express";
import { verifyToken, JwtPayload } from "../utils/jwt";
import { env } from "../config/env";
import { User } from "../models";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = req.cookies[env.COOKIE_NAME];

    if (!token) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const payload = verifyToken(token);

    const user = await User.findByPk(payload.userId, { attributes: ['status'] });
    if (!user || user.status !== 'ACTIVE') {
      res.status(403).json({ error: "Account is suspended or deactivated" });
      return;
    }
    
    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }
}

export function optionalAuth(req: Request, res: Response, next: NextFunction): void {
  try {
    const token = req.cookies[env.COOKIE_NAME];
    if (token) {
      const payload = verifyToken(token);
      req.user = payload;
    }
  } catch {
  }
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (req.user?.role !== "ADMIN") {
    res.status(403).json({ error: "Admin access required" });
    return;
  }
  next();
}
