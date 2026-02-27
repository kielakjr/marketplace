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
  category_id?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
  limit?: number;
}
