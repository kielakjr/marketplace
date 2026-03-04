import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '@/api/ordersApi';
import type { CreateOrderPayload } from '@/types/order';
import { useAppSelector } from '@/store/hooks';

export const orderKeys = {
  all: ['orders'] as const,
  detail: (id: string) => [...orderKeys.all, id] as const,
  seller: () => [...orderKeys.all, 'seller'] as const,
  saleDetail: (id: string) => [...orderKeys.seller(), id] as const,
  admin: () => [...orderKeys.all, 'admin'] as const,
  adminDetail: (id: string) => [...orderKeys.admin(), id] as const,
};

export function useOrders() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  return useQuery({
    queryKey: orderKeys.all,
    queryFn: ordersApi.getAll,
    enabled: isAuthenticated,
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => ordersApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateOrderPayload) => ordersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ordersApi.cancel(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) });
    },
  });
}

export function usePayOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => ordersApi.pay(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}

export function useSentOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ordersApi.sentOrder(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.seller() });
      queryClient.invalidateQueries({ queryKey: orderKeys.saleDetail(id) });
    },
  });
}

export function useSellerOrders() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  return useQuery({
    queryKey: orderKeys.seller(),
    queryFn: ordersApi.getSellerOrders,
    enabled: isAuthenticated,
  });
}

export function useSale(id: string) {
  return useQuery({
    queryKey: orderKeys.saleDetail(id),
    queryFn: () => ordersApi.getSaleById(id),
    enabled: !!id,
  });
}

export function useAdminOrders() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === 'ADMIN';
  return useQuery({
    queryKey: orderKeys.admin(),
    queryFn: ordersApi.adminGetAll,
    enabled: isAuthenticated && isAdmin,
  });
}

export function useAdminOrder(id: string) {
  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === 'ADMIN';
  return useQuery({
    queryKey: orderKeys.adminDetail(id),
    queryFn: () => ordersApi.adminGetById(id),
    enabled: !!id && isAdmin,
  });
}

export function useAdminUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      ordersApi.adminUpdateStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.admin() });
      queryClient.invalidateQueries({ queryKey: orderKeys.adminDetail(id) });
    },
  });
}
