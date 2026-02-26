import { ProductService } from '../services/product';
import { Request, Response } from 'express';

export async function getProducts(req: Request, res: Response) {
  try {
    const products = await ProductService.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}
