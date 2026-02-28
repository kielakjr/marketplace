import { Request, Response } from "express";
import { CategoryService } from "../services/category";
import { createCategorySchema, updateCategorySchema } from "../validation/category";

export async function getCategories(req: Request, res: Response) {
  try {
    const categories = await CategoryService.getAll();
    res.json(categories);
  } catch (error: unknown) {
    if (error instanceof Error) return res.status(500).json({ error: error.message });
    res.status(500).json({ error: "Failed to fetch categories" });
  }
}

export async function getCategoryById(req: Request<{ id: string }>, res: Response) {
  try {
    const category = await CategoryService.getById(parseInt(req.params.id));
    res.json(category);
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "Category not found") return res.status(404).json({ error: error.message });
      return res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to fetch category" });
  }
}

export async function createCategory(req: Request, res: Response) {
  try {
    const validated = createCategorySchema.parse(req.body);
    const category = await CategoryService.create(validated);
    res.status(201).json(category);
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes("already")) return res.status(409).json({ error: error.message });
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to create category" });
  }
}

export async function updateCategory(req: Request<{ id: string }>, res: Response) {
  try {
    const validated = updateCategorySchema.parse(req.body);
    const category = await CategoryService.update(parseInt(req.params.id), validated);
    res.json(category);
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "Category not found") return res.status(404).json({ error: error.message });
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to update category" });
  }
}

export async function deleteCategory(req: Request<{ id: string }>, res: Response) {
  try {
    await CategoryService.delete(parseInt(req.params.id));
    res.status(204).send();
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "Category not found") return res.status(404).json({ error: error.message });
      if (error.message.includes("Cannot delete")) return res.status(400).json({ error: error.message });
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to delete category" });
  }
}
