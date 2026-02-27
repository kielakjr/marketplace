import { Request, Response } from "express";
import { AuthService } from "../services/auth";
import { setTokenCookie, clearTokenCookie } from "../utils/cookie";

export async function registerUser(req: Request, res: Response) {
  try {
    const { token, user } = await AuthService.register(req.body);

    setTokenCookie(res, token);

    res.status(201).json({ user });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes("already")) {
        return res.status(409).json({ error: error.message });
      }
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Registration failed" });
  }
}

export async function loginUser(req: Request, res: Response) {
  try {
    const { token, user } = await AuthService.login(req.body);

    setTokenCookie(res, token);

    res.json({ user });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(401).json({ error: error.message });
    }
    res.status(500).json({ error: "Login failed" });
  }
}

export async function logoutUser(req: Request, res: Response) {
  clearTokenCookie(res);
  res.json({ message: "Logged out successfully" });
}

export async function getMe(req: Request, res: Response) {
  try {
    const user = await AuthService.getMe(req.user!.userId);
    res.json(user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to fetch user" });
  }
}
