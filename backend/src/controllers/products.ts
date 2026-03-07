import { ProductService } from '../services/product';
import { Request, Response } from 'express';
import { ProductFilters } from '../dto/products';

interface ProductCreationAttributes {
  name: string;
  description: string;
  price: number;
  userId: string;
}

interface ProductUpdateAttributes {
  name?: string;
  description?: string;
  price?: number;
}

const VALID_SORT_BY = ['price', 'createdAt'] as const;
const VALID_SORT_ORDER = ['asc', 'desc'] as const;

export async function getProducts(req: Request<{}, {}, {}, ProductFilters>, res: Response) {
  try {
    const filters: ProductFilters = {};

    if (req.query.name) {
      filters.name = req.query.name as string;
    }

    if (req.query.categoryId) {
      const categoryId = parseInt(req.query.categoryId as unknown as string);
      if (isNaN(categoryId)) return res.status(400).json({ error: 'Invalid categoryId' });
      filters.categoryId = categoryId;
    }

    if (req.query.minPrice) {
      const minPrice = parseFloat(req.query.minPrice as unknown as string);
      if (isNaN(minPrice)) return res.status(400).json({ error: 'Invalid minPrice' });
      filters.minPrice = minPrice;
    }

    if (req.query.maxPrice) {
      const maxPrice = parseFloat(req.query.maxPrice as unknown as string);
      if (isNaN(maxPrice)) return res.status(400).json({ error: 'Invalid maxPrice' });
      filters.maxPrice = maxPrice;
    }

    if (req.query.sortBy) {
      if (!VALID_SORT_BY.includes(req.query.sortBy as any)) {
        return res.status(400).json({ error: `sortBy must be one of: ${VALID_SORT_BY.join(', ')}` });
      }
      filters.sortBy = req.query.sortBy as 'price' | 'createdAt';
    }

    if (req.query.sortOrder) {
      if (!VALID_SORT_ORDER.includes(req.query.sortOrder as any)) {
        return res.status(400).json({ error: `sortOrder must be one of: ${VALID_SORT_ORDER.join(', ')}` });
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

    const products = await ProductService.getProducts(filters, req.user ? req.user.userId : undefined);
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

export async function getUserProducts(req: Request<{userId: string}, {}, {}, ProductFilters>, res: Response){
  try {
    const filters: ProductFilters = {};

    if (req.query.name) {
      filters.name = req.query.name as string;
    }

    if (req.query.categoryId) {
      const categoryId = parseInt(req.query.categoryId as unknown as string);
      if (isNaN(categoryId)) return res.status(400).json({ error: 'Invalid categoryId' });
      filters.categoryId = categoryId;
    }

    if (req.query.minPrice) {
      const minPrice = parseFloat(req.query.minPrice as unknown as string);
      if (isNaN(minPrice)) return res.status(400).json({ error: 'Invalid minPrice' });
      filters.minPrice = minPrice;
    }

    if (req.query.maxPrice) {
      const maxPrice = parseFloat(req.query.maxPrice as unknown as string);
      if (isNaN(maxPrice)) return res.status(400).json({ error: 'Invalid maxPrice' });
      filters.maxPrice = maxPrice;
    }

    if (req.query.sortBy) {
      if (!VALID_SORT_BY.includes(req.query.sortBy as any)) {
        return res.status(400).json({ error: `sortBy must be one of: ${VALID_SORT_BY.join(', ')}` });
      }
      filters.sortBy = req.query.sortBy as 'price' | 'createdAt';
    }

    if (req.query.sortOrder) {
      if (!VALID_SORT_ORDER.includes(req.query.sortOrder as any)) {
        return res.status(400).json({ error: `sortOrder must be one of: ${VALID_SORT_ORDER.join(', ')}` });
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

    const products = await ProductService.getUserProducts(req.params.userId, filters);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
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
