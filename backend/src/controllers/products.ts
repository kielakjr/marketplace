import { ProductService } from '../services/product';
import { Request, Response } from 'express';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ProductCreationAttributes {
  name: string;
  description: string;
  price: number;
}

interface ProductUpdateAttributes {
  name?: string;
  description?: string;
  price?: number;
}

export async function getProducts(req: Request, res: Response) {
  try {
    const products = await ProductService.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}

export async function getProductById(req: Request<{ id: string }>, res: Response) {
  try {
    const product = await ProductService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
}

export async function createProduct(req: Request<{}, {}, ProductCreationAttributes>, res: Response) {
  try {
    const product = await ProductService.createProduct(req.body);
    res.status(201).json(product);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to create product' });
  }
}

export async function updateProduct(req: Request<{ id: string }, {}, ProductUpdateAttributes>, res: Response) {
  try {
    const product = await ProductService.updateProduct(req.params.id, req.body);
    res.json(product);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to update product' });
  }
}

export async function deleteProduct(req: Request<{ id: string }>, res: Response) {
  try {
    await ProductService.deleteProduct(req.params.id);
    res.status(204).send();
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to delete product' });
  }
}
