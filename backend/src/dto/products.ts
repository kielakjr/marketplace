export interface ProductFilters {
  name?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  page?: number;
}

export interface ProductDTO {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity_available: number;
  category_id: number;
  user_id: string;
  createdAt: Date;
  updatedAt: Date;
  category?: {
    id: number;
    name: string;
    description?: string;
  };
  seller?: {
    id: string;
    username: string;
    email: string;
  };
}
