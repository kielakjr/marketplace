export interface User {
  id: string;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

export interface UsersData {
  data: User[];
  pagination : {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
}

export interface UsersFilters {
  username?: string;
  email?: string;
  sortBy?: 'username' | 'email' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  page?: number;
}

export interface UserCreationPayload {
  username: string;
  email: string;
  password: string;
}

export interface UserUpdatePayload {
  username?: string;
  email?: string;
  password?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}
