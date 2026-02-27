import api from './axiosInstance';
import type { User, LoginPayload, RegisterPayload } from '@/types/user';

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

  getAll: () =>
    api.get<User[]>('/users').then((res) => res.data),

  getById: (id: string) =>
    api.get<User>(`/users/${id}`).then((res) => res.data),
};
