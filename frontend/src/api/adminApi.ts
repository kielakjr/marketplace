  import api from './axiosInstance';

  export interface DashboardStats {
    totalUsers: number;
    totalAdmins: number;
    totalBanned: number;
    totalProducts: number;
    totalOrders: number;
    totalCategories: number;
  }

  export const adminApi = {
    getStats: () =>
      api.get<DashboardStats>('/admin/stats').then((res) => res.data),
  };
