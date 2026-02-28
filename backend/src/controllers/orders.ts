import { Request, Response } from "express";
import { OrderService } from "../services/order";
import { createOrderSchema, updateOrderStatusSchema } from "../validation/order";

export async function createOrder(req: Request, res: Response) {
  try {
    const validated = createOrderSchema.parse(req.body);
    const order = await OrderService.createOrder(req.user!.userId, validated.items, validated.address_details);
    res.status(201).json(order);
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes("not found")) return res.status(404).json({ error: error.message });
      if (error.message.includes("Insufficient")) return res.status(400).json({ error: error.message });
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to create order" });
  }
}

export async function getUserOrders(req: Request, res: Response) {
  try {
    const orders = await OrderService.getUserOrders(req.user!.userId);
    res.json(orders);
  } catch (error: unknown) {
    if (error instanceof Error) return res.status(500).json({ error: error.message });
    res.status(500).json({ error: "Failed to fetch orders" });
  }
}

export async function getOrderById(req: Request<{ id: string }>, res: Response) {
  try {
    const order = await OrderService.getOrderById(req.params.id, req.user!.userId);
    res.json(order);
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "Order not found") return res.status(404).json({ error: error.message });
      return res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to fetch order" });
  }
}

export async function cancelOrder(req: Request<{ id: string }>, res: Response) {
  try {
    const order = await OrderService.cancelOrder(req.params.id, req.user!.userId);
    res.json(order);
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "Order not found") return res.status(404).json({ error: error.message });
      if (error.message.includes("Cannot cancel")) return res.status(400).json({ error: error.message });
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to cancel order" });
  }
}

export async function getAllOrders(req: Request, res: Response) {
  try {
    const orders = await OrderService.getAllOrders();
    res.json(orders);
  } catch (error: unknown) {
    if (error instanceof Error) return res.status(500).json({ error: error.message });
    res.status(500).json({ error: "Failed to fetch orders" });
  }
}

export async function updateOrderStatus(req: Request<{ id: string }>, res: Response) {
  try {
    const validated = updateOrderStatusSchema.parse(req.body);
    const order = await OrderService.updateOrderStatus(req.params.id, validated.status);
    res.json(order);
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "Order not found") return res.status(404).json({ error: error.message });
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to update order" });
  }
}
