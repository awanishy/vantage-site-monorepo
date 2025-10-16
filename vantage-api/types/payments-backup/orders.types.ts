// ============================================================================
// INTERNAL ORDER TYPES
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

export interface CheckActiveOrdersRequest {
  programId: string;
  selectedCurrency: string;
}

export interface CheckActiveOrdersResponse {
  hasActiveOrder: boolean;
  activeOrder?: GetOrderResponse;
}

// ============================================================================
// ADDITIONAL TYPES for payments-backup
// ============================================================================

export type OrderStatus =
  | "ACTIVE"
  | "PAID"
  | "EXPIRED"
  | "CANCELLED"
  | "TERMINATED";

export interface OrderDoc {
  orderNumber: string;
  userId: any;
  programId: any;
  orderAmount: number;
  orderCurrency: string;
  status: OrderStatus;
  merchantOrderId: string;
  orderType?: string;
  expiresAt?: Date;
  metadata?: {
    source?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface PricingInput {
  programId: string;
  selectedCurrency: string;
}

export interface PricingResult {
  orderAmount: number;
  orderCurrency: string;
  programCurrency: string;
  selectedCurrency: string;
  pricingSnapshot: any;
  fx: any;
}
