
export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  total: number;
  shipping_address: string;
  phone: string;
  full_name: string;
  payment_method: PaymentMethod;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  email: string;  // Making this required, not optional
  user_email?: string; // For backward compatibility
}

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
export type PaymentMethod = 'card' | 'cash' | 'bank_transfer';

export interface OrderFilters {
  status?: OrderStatus;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}
