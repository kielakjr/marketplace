import { Product, User, Category } from '../models';
import { Op } from 'sequelize';
import { ProductFilters, ProductDTO } from '../dto/products';

export class ProductService {
  static async getProducts(filters?: Partial<ProductFilters>, userId?: string) {
    console.log('Fetching products with filters:', filters, 'for user:', userId);
    const where: any = {
      quantity_available: { [Op.gt]: 0 },
    };

    if (userId) {
      where.user_id = { [Op.ne]: userId };
    }

    if (filters?.name) {
      where.name = { [Op.iLike]: `%${filters.name}%` };
    }

    if (filters?.categoryId) {
      where.category_id = filters.categoryId;
    }

    if (filters?.minPrice && !filters?.maxPrice) {
      where.price = { [Op.gte]: filters.minPrice };
    } else if (!filters?.minPrice && filters?.maxPrice) {
      where.price = { [Op.lte]: filters.maxPrice };
    } else if (filters?.minPrice && filters?.maxPrice) {
      where.price = { [Op.between]: [filters.minPrice, filters.maxPrice] };
    }

    const sortBy = filters?.sortBy ?? 'createdAt';
    const sortOrder = filters?.sortOrder ?? 'asc';
    const limit = filters?.limit ?? 20;
    const page = filters?.page ?? 1;
    const offset = (page - 1) * limit;

    const { rows: products, count: total } = await Product.findAndCountAll({
      where,
      order: [[sortBy, sortOrder]],
      limit,
      offset,
    });

    return {
      data: products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getProductById(id: string): Promise<ProductDTO | null> {
    return await Product.findOne({
      where: { id },
      include: [
        { model: User, as: "seller", attributes: ['id', 'username', 'email'] },
        { model: Category, as: "category" }
      ]
      }) as ProductDTO | null;
  }

  static async getUserProducts(userId: string, filters?: Partial<ProductFilters>) {
    const where: any = {
      user_id: userId,
    };

    if (filters?.name) {
      where.name = { [Op.iLike]: `%${filters.name}%` };
    }

    if (filters?.categoryId) {
      where.category_id = filters.categoryId;
    }

    if (filters?.minPrice && !filters?.maxPrice) {
      where.price = { [Op.gte]: filters.minPrice };
    } else if (!filters?.minPrice && filters?.maxPrice) {
      where.price = { [Op.lte]: filters.maxPrice };
    } else if (filters?.minPrice && filters?.maxPrice) {
      where.price = { [Op.between]: [filters.minPrice, filters.maxPrice] };
    }

    const sortBy = filters?.sortBy ?? 'createdAt';
    const sortOrder = filters?.sortOrder ?? 'asc';
    const limit = filters?.limit ?? 20;
    const page = filters?.page ?? 1;
    const offset = (page - 1) * limit;

    const { rows: products, count: total } = await Product.findAndCountAll({
      where,
      order: [[sortBy, sortOrder]],
      limit,
      offset,
    });

    return {
      data: products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async createProduct(data: Partial<Product>) {
    return Product.create(data);
  }

  static async updateProduct(id: string, data: Partial<Product>) {
    const product = await Product.findByPk(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product.update(data);
  }

  static async deleteProduct(id: string) {
    const product = await Product.findByPk(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product.destroy();
  }
}
