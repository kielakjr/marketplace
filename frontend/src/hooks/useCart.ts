import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '@/api/cartApi';
import type { AddToCartPayload, UpdateCartItemPayload } from '@/types/cart';
import { useAppSelector } from '@/store/hooks';

export const cartKeys = {
  all: ['cart'] as const,
};

export function useCart() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return useQuery({
    queryKey: cartKeys.all,
    queryFn: cartApi.getCart,
    enabled: isAuthenticated,
  });
}

export function useCartItemCount() {
  const { data: cart } = useCart();
  return cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
}

export function useCartTotal() {
  const { data: cart } = useCart();
  return (
    cart?.items.reduce(
      (sum, item) => sum + (item.product?.price ?? 0) * item.quantity,
      0
    ) ?? 0
  );
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AddToCartPayload) => cartApi.addItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, data }: { itemId: string; data: UpdateCartItemPayload }) =>
      cartApi.updateItem(itemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => cartApi.removeItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => cartApi.clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}
