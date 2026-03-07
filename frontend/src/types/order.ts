export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED';

export interface OrderItemProduct {
  id: string;
  name: string;
  image_urls: string[];
  price: number;
  OrderItem: {
    quantity: number;
    price_per_unit: number;
  };
}

export interface OrderPayment {
  id: string;
  amount: number;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  payment_gateway_id?: string;
}

export interface OrderDelivery {
  id: string;
  tracking_number?: string;
  status: 'PREPARING' | 'SHIPPED' | 'IN_TRANSIT' | 'DELIVERED' | 'FAILED_DELIVERY';
  address: {
    street: string;
    street_number: string;
    city: string;
    postal_code: string;
  };
}

export interface OrderUser {
  id: string;
  username: string;
  email: string;
}

export interface Order {
  id: string;
  total_amount: number;
  status: OrderStatus;
  buyer_id: string;
  seller_id: string | null;
  products: OrderItemProduct[];
  payment: OrderPayment | null;
  delivery: OrderDelivery | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderDetailed extends Order {
  buyer: OrderUser;
  seller: OrderUser | null;
}

export interface CreateOrderPayload {
  items: Array<{ product_id: string; quantity: number }>;
  address: {
    street: string;
    street_number: string;
    city: string;
    postal_code: string;
  };
}
