export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreationAttributes {
  username: string;
  email: string;
  password: string;
}

export interface UserUpdateAttributes {
  username?: string;
  email?: string;
  password?: string;
  role?: 'USER' | 'ADMIN';
  status?: 'ACTIVE' | 'BANNED' | 'DEACTIVATED';
}

export interface UserFilters {
  username?: string;
  email?: string;
  sortBy?: 'name' | 'email' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  page?: number;
}
