  import { User, Product, Order, Category } from '../models';

  export class AdminService {
    static async getDashboardStats() {
      const [totalUsers, totalAdmins, totalBanned, totalProducts, totalOrders, totalCategories] =
        await Promise.all([
          User.count(),
          User.count({ where: { role: 'ADMIN' } }),
          User.count({ where: { status: 'BANNED' } }),
          Product.count(),
          Order.count(),
          Category.count(),
        ]);

      return { totalUsers, totalAdmins, totalBanned, totalProducts, totalOrders, totalCategories };
    }
  }
