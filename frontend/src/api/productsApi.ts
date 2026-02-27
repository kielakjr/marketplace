import api from './axiosInstance';
import type { Product, ProductCreationPayload, ProductUpdatePayload, ProductFilters } from '@/types/product';

export const productsApi = {
  getAll: (filters?: ProductFilters) =>
    api.get<Product[]>('/products', { params: filters }).then((res) => res.data),

  getById: (id: string) =>
    api.get<Product>(`/products/${id}`).then((res) => res.data),

  create: (data: ProductCreationPayload) =>
    api.post<Product>('/products', data).then((res) => res.data),

  update: (id: string, data: ProductUpdatePayload) =>
    api.put<Product>(`/products/${id}`, data).then((res) => res.data),

  delete: (id: string) =>
    api.delete(`/products/${id}`).then((res) => res.data),
};
