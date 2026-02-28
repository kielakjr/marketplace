import api from './axiosInstance';
import type { Category } from '@/types/category';

export const categoriesApi = {
  getAll: () =>
    api.get<Category[]>('/categories').then((res) => res.data),

  getById: (id: number) =>
    api.get<Category>(`/categories/${id}`).then((res) => res.data),

  create: (name: string, desciption?: string) =>
    api.post<Category>('/categories', {name, desciption}).then((res) => res.data),
};
