const API_BASE = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// ─── Payment (Mock Stripe) ────────────────────────────────────────

export interface PaymentIntent {
  id: string;
  status: 'succeeded' | 'failed';
  error?: string;
  amount: number;
  currency: string;
  brand?: string;
  last4?: string;
}

export function createPaymentIntent(amount: number, cardNumber: string): Promise<PaymentIntent> {
  return request('/payments/create-intent', {
    method: 'POST',
    body: JSON.stringify({ amount, currency: 'usd', cardNumber }),
  });
}

// ─── Orders ───────────────────────────────────────────────────────

export interface OrderItem {
  productId: string;
  size: string;
  quantity: number;
}

export interface CustomerInfo {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zip: string;
  country: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerEmail: string;
  items: Array<{
    productId: string;
    name: string;
    size: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  shipping: number;
  total: number;
  paymentIntentId: string | null;
  status: string;
  trackingNumber: string;
  estimatedDelivery: string;
  createdAt: string;
}

export function createOrder(
  items: OrderItem[],
  customer: CustomerInfo,
  paymentIntentId: string
): Promise<Order> {
  return request('/orders', {
    method: 'POST',
    body: JSON.stringify({ items, customer, paymentIntentId }),
  });
}

export function getOrder(orderId: string): Promise<Order> {
  return request(`/orders/${orderId}`);
}

// ─── Inventory ────────────────────────────────────────────────────

export interface InventoryProduct {
  id: string;
  name: string;
  price: number;
  stock: Record<string, number>;
}

export function getInventory(): Promise<InventoryProduct[]> {
  return request('/inventory');
}

// ─── Emails ───────────────────────────────────────────────────────

export interface EmailRecord {
  id: string;
  to: string;
  type: string;
  subject: string;
  orderId: string;
  sentAt: string;
}

export function getOrderEmails(orderId: string): Promise<EmailRecord[]> {
  return request(`/emails/${orderId}`);
}
