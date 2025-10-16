// ============================================================================
// ORDER TYPES - Replicas of backend types
// ============================================================================

// ============================================================================
// INTERNAL ORDER TYPES (Replicas from backend)
// ============================================================================

export interface CreateOrderRequest {
  programId: string;
  selectedCurrency: string;
}

export interface CreateOrderResponse {
  orderId: string;
  orderNumber: string;
  amount: number;
  currency: string;
  status: string;
  expiresAt: string;
}

export interface GetOrderResponse {
  orderId: string;
  orderNumber: string;
  userId: string;
  programId: string;
  orderAmount: number;
  orderCurrency: string;
  programCurrency: string;
  selectedCurrency: string;
  fx?: {
    fromCurrency: string;
    toCurrency: string;
    rate: number;
    conversionDate: string;
  };
  pricingSnapshot: {
    currency: string;
    tuition: number;
    taxesIncluded: boolean;
  };
  status: "ACTIVE" | "PAID" | "EXPIRED" | "CANCELLED";
  orderNote?: string;
  expiresAt: string;
  metadata: {
    source: "authenticated_user" | "guest_user";
    programSlug: string;
    pricingVersion: string;
  };
  payments: Array<{
    paymentId: string;
    cfOrderId: string;
    cfPaymentId?: string;
    paymentSessionId: string;
    amount: number;
    currency: string;
    status: "PENDING" | "SUCCESS" | "FAILED" | "USER_DROPPED";
    paymentMessage?: string;
    bankReference?: string;
    paymentTime?: string;
    paymentCompletionTime?: string;
    createdAt: string;
    updatedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface GetMyOrdersResponse {
  orders: GetOrderResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Guest orders use the same shape as authenticated orders
export type GetGuestOrdersResponse = GetMyOrdersResponse;

// Lightweight order view for list rendering
export interface OrderListItem {
  orderId: string;
  orderNumber: string;
  orderAmount: number;
  orderCurrency: string;
  status: OrderStatus;
  createdAt: string;
  paymentsSummary: {
    totalPayments: number;
    successfulPayments: number;
    lastPaymentStatus?: PaymentStatus;
  };
}

export interface CheckActiveOrdersRequest {
  programId: string;
  selectedCurrency: string;
}

export interface CheckActiveOrdersResponse {
  hasActiveOrder: boolean;
  activeOrder?: GetOrderResponse;
}

// ============================================================================
// GUEST ORDER TYPES (Replicas from backend)
// ============================================================================

export interface GuestUser {
  userId: string;
  email: string;
  name: string;
  phone: string;
  isGuest: true;
  createdAt: string;
}

export interface CreateGuestUserRequest {
  email: string;
  name: string;
  phone: string;
  programId?: string; // Optional for callback URL construction
}

export interface CreateGuestUserResponse {
  userId: string;
  email: string;
  name: string;
  phone: string;
  isGuest: true;
  createdAt: string;
}

export interface CreateGuestOrderRequest {
  programId: string;
  selectedCurrency: string;
  guestUserId: string;
}

export interface CreateGuestOrderResponse {
  orderId: string;
  orderNumber: string;
  amount: number;
  currency: string;
  status: string;
  expiresAt: string;
  guestUserId: string;
}

// ============================================================================
// ORDER STATUS TYPES
// ============================================================================

export type OrderStatus = "ACTIVE" | "PAID" | "EXPIRED" | "CANCELLED";
export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "USER_DROPPED";

// ============================================================================
// ORDER FILTER TYPES
// ============================================================================

export interface OrderFilters {
  status?: OrderStatus;
  currency?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface OrderSearchParams {
  programId?: string;
  selectedCurrency?: string;
  status?: OrderStatus;
  page?: number;
  limit?: number;
}

// ============================================================================
// ALIASES FOR COMPATIBILITY
// ============================================================================

// These are aliases to maintain compatibility with existing code
export type Order = GetOrderResponse;
export type Payment = GetOrderResponse["payments"][0];
