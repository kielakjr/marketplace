import api from './axiosInstance';
import type { Category } from '@/types/category';

export const categoriesApi = {
  getAll: () =>
    api.get<Category[]>('/categories').then((res) => res.data),

  getById: (id: number) =>
    api.get<Category>(`/categories/${id}`).then((res) => res.data),

  create: (name: string, description?: string) =>
    api.post<Category>('/categories', {name, description}).then((res) => res.data),

  update: (id: number, name?: string, description?: string) =>
    api.put<Category>(`/categories/${id}`, { name, description }).then((res) => res.data),

  delete: (id: number) =>
    api.delete(`/categories/${id}`).then((res) => res.data),
};
