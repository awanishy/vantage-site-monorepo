// ============================================================================
// REFUND TYPES - Additional refund-specific types
// ============================================================================

export interface RefundSplit {
  vendor_id: string;
  amount?: number;
  percentage?: number;
  tags?: Record<string, any>;
}

export interface RefundOffer {
  offer_id: string;
  offer_type: string;
  offer_meta: {
    offer_title: string;
    offer_description: string;
    offer_code: string;
    offer_start_time: string;
    offer_end_time: string;
  };
  offer_redemption: {
    redemption_status: string;
    discount_amount: number;
    cashback_amount: number;
  };
}

export interface RefundStatusUpdate {
  refundId: string;
  cfRefundId: string;
  oldStatus: "PENDING" | "SUCCESS" | "FAILED";
  newStatus: "PENDING" | "SUCCESS" | "FAILED";
  updatedAt: string;
  reason?: string;
}

export interface RefundAnalytics {
  totalRefunds: number;
  totalRefundAmount: number;
  averageRefundAmount: number;
  refundSuccessRate: number;
  refundFailureRate: number;
  refundsByStatus: {
    PENDING: number;
    SUCCESS: number;
    FAILED: number;
  };
  refundsByCurrency: Record<
    string,
    {
      count: number;
      totalAmount: number;
    }
  >;
  refundsByMonth: Array<{
    month: string;
    count: number;
    totalAmount: number;
  }>;
}

// ============================================================================
// ADDITIONAL TYPES for payments-backup
// ============================================================================

export interface RefundDoc {
  orderId: any;
  paymentId: any;
  cfRefundId: string;
  refundId: string;
  cfPaymentId: string;
  cfOrderId: string;
  amount: number;
  currency: string;
  status: string;
  reason?: string;
  arn?: string;
  [key: string]: any;
}
