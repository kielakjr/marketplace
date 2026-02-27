import { UserService } from "../services/user";
import { Request, Response } from "express";
import { UserCreationAttributes, UserUpdateAttributes } from "../dto/user";

export async function getUsers(req: Request, res: Response) {
  try {
    const users = await UserService.getAllUsers();
    res.json(users);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to fetch users" });
  }
}

export async function getUserById(req: Request<{ id: string }>, res: Response) {
  try {
    const user = await UserService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to fetch user" });
  }
}

export async function createUser(req: Request<{}, {}, UserCreationAttributes>, res: Response) {
  try {
    const user = await UserService.createUser(req.body);
    res.status(201).json(user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to create user" });
  }
}

export async function updateUser(req: Request<{ id: string }, {}, UserUpdateAttributes>, res: Response) {
  try {
    const user = await UserService.updateUser(req.params.id, req.body);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to update user" });
  }
}

export async function deleteUser(req: Request<{ id: string }>, res: Response) {
  try {
    await UserService.deleteUser(req.params.id);
    res.status(204).send();
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to delete user" });
  }
}
