// ============================================================================
// PAYMENT SESSION TYPES
// ============================================================================

export interface CreatePaymentSessionRequest {
  // No body needed, orderId from params
}

export interface CreatePaymentSessionResponse {
  orderId: string;
  orderNumber: string;
  cfOrderId: string;
  paymentSessionId: string;
  paymentId: string;
  amount: number;
  currency: string;
  status: string;
  expiresAt: string;
}

// ============================================================================
// PAYMENT VERIFICATION TYPES
// ============================================================================

export interface VerifyPaymentRequest {
  // No body needed, orderId from params
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  data?: {
    orderId: string;
    orderNumber: string;
    cfOrderId: string;
    paymentId: string;
    paymentStatus: string;
    paymentAmount: number;
    paymentCurrency: string;
    paymentTime?: string;
    paymentCompletionTime?: string;
    bankReference?: string;
    paymentMessage?: string;
  };
}

// ============================================================================
// WEBHOOK TYPES
// ============================================================================

export interface WebhookRequest {
  data: any;
  type: string;
  created_at: string;
}

export interface WebhookResponse {
  success: boolean;
  message: string;
}

// ============================================================================
// REFUND TYPES
// ============================================================================

export interface CreateRefundRequest {
  refundAmount: number;
  refundId: string;
  refundNote?: string;
}

export interface CreateRefundResponse {
  refundId: string;
  cfRefundId: string;
  cfPaymentId: string;
  cfOrderId: string;
  refundAmount: number;
  refundCurrency: string;
  refundStatus: "PENDING" | "SUCCESS" | "FAILED";
  refundNote?: string;
  refundArn?: string;
  refundCharge?: number;
  refundMode?: string;
  refundSpeed?: string;
  refundCreatedAt: string;
  refundProcessedAt?: string;
}

export interface GetRefundResponse {
  refundId: string;
  cfRefundId: string;
  orderId: string;
  paymentId: string;
  cfPaymentId: string;
  cfOrderId: string;
  refundAmount: number;
  refundCurrency: string;
  refundStatus: "PENDING" | "SUCCESS" | "FAILED";
  refundNote?: string;
  refundArn?: string;
  refundCharge?: number;
  refundMode?: string;
  refundSpeed?: string;
  refundSplits?: Array<{
    vendor_id: string;
    amount?: number;
    percentage?: number;
    tags?: Record<string, any>;
  }>;
  refundCreatedAt: string;
  refundProcessedAt?: string;
  refundStatusDescription?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// ADMIN TYPES
// ============================================================================

export interface AdminStatsResponse {
  totalOrders: number;
  totalOrderAmount: number;
  totalPayments: number;
  totalRefunds: number;
  orderStatusBreakdown: {
    ACTIVE: number;
    PAID: number;
    EXPIRED: number;
    CANCELLED: number;
  };
  paymentStatusBreakdown: {
    PENDING: number;
    SUCCESS: number;
    FAILED: number;
    USER_DROPPED: number;
  };
  refundStatusBreakdown: {
    PENDING: number;
    SUCCESS: number;
    FAILED: number;
  };
  recentOrders: Array<{
    orderId: string;
    orderNumber: string;
    orderAmount: number;
    orderCurrency: string;
    status: string;
    createdAt: string;
  }>;
  recentPayments: Array<{
    paymentId: string;
    orderId: string;
    amount: number;
    currency: string;
    status: string;
    paymentTime?: string;
    createdAt: string;
  }>;
}

// ============================================================================
// PRICING TYPES
// ============================================================================

export interface GetPricingRequest {
  programId: string;
  selectedCurrency: string;
}

export interface GetPricingResponse {
  programId: string;
  programSlug: string;
  programName: string;
  programCurrency: string;
  selectedCurrency: string;
  pricing: {
    currency: string;
    tuition: number;
    taxesIncluded: boolean;
    totalAmount: number;
  };
  fx?: {
    fromCurrency: string;
    toCurrency: string;
    rate: number;
    conversionDate: string;
  };
  pricingVersion: string;
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export interface PaymentError {
  success: false;
  message: string;
  error?: string;
  code?: string;
  details?: any;
}

export interface PaymentSuccess<T = any> {
  success: true;
  data: T;
  message?: string;
}

export type PaymentResponse<T = any> = PaymentSuccess<T> | PaymentError;
