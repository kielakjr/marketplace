import api from './axiosInstance';
import type { Cart, CartItem, AddToCartPayload, UpdateCartItemPayload } from '@/types/cart';

export const cartApi = {
  getCart: () =>
    api.get<Cart>('/cart').then((res) => res.data),

  addItem: (data: AddToCartPayload) =>
    api.post<CartItem>('/cart/items', data).then((res) => res.data),

  updateItem: (itemId: string, data: UpdateCartItemPayload) =>
    api.patch<CartItem>(`/cart/items/${itemId}`, data).then((res) => res.data),

  removeItem: (itemId: string) =>
    api.delete(`/cart/items/${itemId}`).then((res) => res.data),

  clearCart: () =>
    api.delete('/cart').then((res) => res.data),
};
