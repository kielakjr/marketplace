import api from './axiosInstance';
import type { User, LoginPayload, RegisterPayload, UsersData, UsersFilters } from '@/types/user';

export interface AuthResponse {
  user: User;
}

export const usersApi = {
  login: (data: LoginPayload) =>
    api.post<AuthResponse>('/auth/login', data).then((res) => res.data),

  register: (data: RegisterPayload) =>
    api.post<AuthResponse>('/auth/register', data).then((res) => res.data),

  getMe: () =>
    api.get<User>('/auth/me').then((res) => res.data),

  logout: () =>
    api.post('/auth/logout').then((res) => res.data),

  getAll: (filters?: UsersFilters) =>
    api.get<UsersData>('/users', { params: filters }).then((res) => res.data),

  getById: (id: string) =>
    api.get<User>(`/users/${id}`).then((res) => res.data),

  create: (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<User>('/users', data).then((res) => res.data),

  update: (id: string, data: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>) =>
    api.put<User>(`/users/${id}`, data).then((res) => res.data),

  delete: (id: string) =>
    api.delete(`/users/${id}`).then((res) => res.data),

  toggleRole: (id: string) =>
    api.post(`/users/${id}/toggle-role`).then((res) => res.data),

  updateStatus: (id: string, status: 'ACTIVE' | 'BANNED' | 'DEACTIVATED') =>
    api.patch<User>(`/users/${id}/status`, { status }).then((res) => res.data),
};
