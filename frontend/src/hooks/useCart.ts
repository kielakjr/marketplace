import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '@/api/cartApi';
import type { AddToCartPayload, UpdateCartItemPayload } from '@/types/cart';
import { useAppSelector } from '@/store/hooks';

export const cartKeys = {
  all: ['carts'] as const,
};

export function useCarts() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return useQuery({
    queryKey: cartKeys.all,
    queryFn: cartApi.getCarts,
    enabled: isAuthenticated,
  });
}

export function useCartItemCount() {
  const { data: carts } = useCarts();
  return (
    carts?.reduce(
      (sum, cart) => sum + cart.items.reduce((s, item) => s + item.quantity, 0),
      0
    ) ?? 0
  );
}

export function useCartTotal() {
  const { data: carts } = useCarts();
  return (
    carts?.reduce(
      (sum, cart) =>
        sum +
        cart.items.reduce(
          (s, item) => s + (item.product?.price ?? 0) * item.quantity,
          0
        ),
      0
    ) ?? 0
  );
}

export function useSellerCart(sellerId: string) {
  const { data: carts } = useCarts();
  return carts?.find((cart) => cart.seller_id === sellerId);
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
    mutationFn: (sellerId: string) => cartApi.clearCart(sellerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}
