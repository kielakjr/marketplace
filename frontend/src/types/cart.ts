export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  product?: {
    id: string;
    name: string;
    image_url?: string;
    price: number;
    quantity_available: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  id: string;
  user_id: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartPayload {
  product_id: string;
  quantity: number;
}

export interface UpdateCartItemPayload {
  quantity: number;
}
