import { Request, Response } from "express";
import { CartService } from "../services/cart";
import { addToCartSchema, updateCartItemSchema } from "../validation/cart";

interface CartProductAtrributes {
  product_id: string;
  quantity: number;
}

export async function getCart(req: Request, res: Response) {
  try {
    const cart = await CartService.getCart(req.user!.userId);
    res.json(cart);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to fetch cart" });
  }
}

export async function addCartItem(req: Request<{}, {}, CartProductAtrributes>, res: Response) {
  try {
    const validated = addToCartSchema.parse(req.body);
    const item = await CartService.addItem(
      req.user!.userId,
      validated.product_id,
      validated.quantity
    );
    res.status(201).json(item);
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "Product not found") {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === "Insufficient stock") {
        return res.status(400).json({ error: error.message });
      }
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to add item to cart" });
  }
}

export async function updateCartItem(req: Request<{ itemId: string }>, res: Response) {
  try {
    const validated = updateCartItemSchema.parse(req.body);
    const item = await CartService.updateItem(
      req.user!.userId,
      req.params.itemId,
      validated.quantity
    );
    res.json(item);
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "Cart item not found") {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === "Insufficient stock") {
        return res.status(400).json({ error: error.message });
      }
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to update cart item" });
  }
}

export async function removeCartItem(req: Request<{ itemId: string }>, res: Response) {
  try {
    await CartService.removeItem(req.user!.userId, req.params.itemId);
    res.status(204).send();
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "Cart item not found") {
        return res.status(404).json({ error: error.message });
      }
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to remove cart item" });
  }
}

export async function clearCart(req: Request, res: Response) {
  try {
    await CartService.clearCart(req.user!.userId);
    res.status(204).send();
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to clear cart" });
  }
}
