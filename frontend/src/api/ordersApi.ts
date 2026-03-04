import api from './axiosInstance';
import type { Order, OrderDetailed, CreateOrderPayload } from '@/types/order';

export const ordersApi = {
  getAll: () =>
    api.get<Order[]>('/orders').then((res) => res.data),

  getById: (id: string) =>
    api.get<OrderDetailed>(`/orders/${id}`).then((res) => res.data),

  create: (data: CreateOrderPayload) =>
    api.post<Order>('/orders', data).then((res) => res.data),

  cancel: (id: string) =>
    api.patch<Order>(`/orders/${id}/cancel`).then((res) => res.data),

  pay: (orderId: string) =>
    api.post(`/payments/orders/${orderId}/pay`).then((res) => res.data),

  getSellerOrders: () =>
    api.get<Order[]>('/orders/seller').then((res) => res.data),

  getSaleById: (id: string) =>
    api.get<OrderDetailed>(`/orders/seller/${id}`).then((res) => res.data),

  adminGetAll: () =>
    api.get<OrderDetailed[]>('/orders/admin/all').then((res) => res.data),

  adminGetById: (id: string) =>
    api.get<OrderDetailed>(`/orders/admin/${id}`).then((res) => res.data),

  adminUpdateStatus: (id: string, status: string) =>
    api.patch<Order>(`/orders/admin/${id}/status`, { status }).then((res) => res.data),
};
