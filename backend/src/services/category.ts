import { Category, Product } from "../models";

export class CategoryService {
  static async getAll() {
    return Category.findAll({ order: [["name", "ASC"]] });
  }

  static async getById(id: number) {
    const category = await Category.findByPk(id, {
      include: [{ model: Product, as: "products" }],
    });
    if (!category) throw new Error("Category not found");
    return category;
  }

  static async create(data: { name: string; description?: string }) {
    const existing = await Category.findOne({ where: { name: data.name } });
    if (existing) throw new Error("Category already exists");
    return Category.create(data);
  }

  static async update(id: number, data: { name?: string; description?: string }) {
    const category = await Category.findByPk(id);
    if (!category) throw new Error("Category not found");
    if (data.name) {
      const existing = await Category.findOne({ where: { name: data.name } });
      if (existing && existing.id !== id) throw new Error("Category name already taken");
    }
    return category.update(data);
  }

  static async delete(id: number) {
    const category = await Category.findByPk(id);
    if (!category) throw new Error("Category not found");
    const productCount = await Product.count({ where: { category_id: id } });
    if (productCount > 0) throw new Error("Cannot delete category with products");
    return category.destroy();
  }
}
