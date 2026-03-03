import { UserService } from "../services/user";
import { Request, Response } from "express";
import { UserCreationAttributes, UserUpdateAttributes, UserFilters } from "../dto/user";

export async function getUsers(req: Request<{}, {}, {}, UserFilters>, res: Response) {
  try {
    const filters: UserFilters = {};

    if (req.query.username) {
      filters.username = req.query.username as string;
    }

    if (req.query.email) {
      filters.email = req.query.email as string;
    }

    if (req.query.sortBy) {
      const VALID_SORT_BY = ['name', 'email', 'createdAt'] as const;
      if (!VALID_SORT_BY.includes(req.query.sortBy as any)) {
        return res.status(400).json({ error: `sortBy must be one of: ${VALID_SORT_BY.join(', ')}` });
      }
      filters.sortBy = req.query.sortBy as 'name' | 'email' | 'createdAt';
    }

    if (req.query.sortOrder) {
      const VALID_SORT_ORDER = ['asc', 'desc'] as const;
      if (!VALID_SORT_ORDER.includes(req.query.sortOrder as any)) {
        return res.status(400).json({ error: `sortOrder must be one of: asc, desc` });
      }
      filters.sortOrder = req.query.sortOrder as 'asc' | 'desc';
    }

    if (req.query.limit) {
      const limit = parseInt(req.query.limit as unknown as string);
      if (isNaN(limit) || limit < 1) return res.status(400).json({ error: 'Invalid limit' });
      filters.limit = limit;
    }

    if (req.query.page) {
      const page = parseInt(req.query.page as unknown as string);
      if (isNaN(page) || page < 1) return res.status(400).json({ error: 'Invalid page' });
      filters.page = page;
    }

    const result = await UserService.getAllUsers(filters);
    res.json(result);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to fetch users' });
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

export async function toggleUserRole(req: Request<{ id: string }>, res: Response) {
  try {
    const user = await UserService.toggleRole(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to toggle user role" });
  }
}
