import { Product } from '../models';

export class ProductService {
  static async getAllProducts() {
    return Product.findAll();
  }
}
