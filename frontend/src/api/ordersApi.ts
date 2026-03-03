import api from './axiosInstance';
import type { Order, CreateOrderPayload, OrderDetailed } from '@/types/order';

export const ordersApi = {
  getAll: () =>
    api.get<Order[]>('/orders').then((res) => res.data),

  getAdminAll: () =>
    api.get<Order[]>('/orders/admin/all').then((res) => res.data),

  getById: (id: string) =>
    api.get<OrderDetailed>(`/orders/${id}`).then((res) => res.data),

  getSellersOrders: (sellerId: string) =>
    api.get<Order[]>(`/orders/seller/${sellerId}`).then((res) => res.data),

  create: (data: CreateOrderPayload) =>
    api.post<Order>('/orders', data).then((res) => res.data),

  cancel: (id: string) =>
    api.patch<Order>(`/orders/${id}/cancel`).then((res) => res.data),

  pay: (orderId: string) =>
    api.post(`/payments/orders/${orderId}/pay`).then((res) => res.data),
};
