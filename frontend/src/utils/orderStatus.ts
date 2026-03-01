import type { OrderStatus } from '@/types/order';

export const orderStatusLabels: Record<OrderStatus, string> = {
  PENDING: 'Oczekujące',
  PROCESSING: 'W realizacji',
  SHIPPED: 'Wysłane',
  COMPLETED: 'Zakończone',
  CANCELLED: 'Anulowane',
};

export const orderStatusVariant: Record<OrderStatus, 'default' | 'info' | 'warning' | 'success' | 'danger'> = {
  PENDING: 'warning',
  PROCESSING: 'info',
  SHIPPED: 'info',
  COMPLETED: 'success',
  CANCELLED: 'danger',
};

export const paymentStatusLabels: Record<string, string> = {
  PENDING: 'Nieopłacone',
  PAID: 'Opłacone',
  FAILED: 'Nieudane',
  REFUNDED: 'Zwrócone',
};

export const deliveryStatusLabels: Record<string, string> = {
  PREPARING: 'Przygotowywane',
  SHIPPED: 'Wysłane',
  IN_TRANSIT: 'W drodze',
  DELIVERED: 'Dostarczone',
  FAILED_DELIVERY: 'Nie dostarczono',
};
