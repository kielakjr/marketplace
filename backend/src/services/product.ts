import { Product } from '../models';

export class ProductService {
  static async getAllProducts() {
    return Product.findAll();
  }

  static async getProductById(id: string) {
    return Product.findByPk(id);
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
