export interface Product {
  id: string;
  name: string;
  image_url?: string;
  description?: string;
  price: number;
  quantity_available: number;
  user_id: string;
  category_id: number;
  createdAt: string;
  updatedAt: string;
}


export interface ProductWithCategoryAndSeller extends Product {
  category: {
    id: number;
    name: string;
    description?: string;
  };
  seller: {
    id: string;
    username: string;
    email: string;
  };
}

export interface ProductCreationPayload {
  name: string;
  image_url?: string;
  description?: string;
  price: number;
  quantity_available: number;
  category_id: number;
}

export interface ProductUpdatePayload {
  name?: string;
  image_url?: string;
  description?: string;
  price?: number;
  quantity_available?: number;
  category_id?: number;
}

export interface ProductFilters {
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  name?: string;
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}
