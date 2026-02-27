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
}
