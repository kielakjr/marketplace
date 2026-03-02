import { Product, User, Category } from '../models';
import { Op } from 'sequelize';
import { ProductFilters, ProductDTO } from '../dto/products';

export class ProductService {
  static async getProducts(filters?: Partial<ProductFilters>) {
    const where: any = {
      quantity_available: { [Op.gt]: 0 },
    };

    if (filters?.name) {
      where.name = { [Op.like]: `%${filters.name}%` };
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

    if (filters?.sortBy && filters?.sortOrder) {
      return Product.findAll({ where, order: [[filters.sortBy, filters.sortOrder]] });
    }

    return Product.findAll({ where });

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

  static async getUserProducts(userId: string) {
    return Product.findAll({ where: {
      user_id: userId
    }})
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
