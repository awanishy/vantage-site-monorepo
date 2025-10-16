// ============================================================================
// CASHFREE API TYPES - Complete mapping from documentation
// ============================================================================

// ============================================================================
// CREATE ORDER API TYPES
// ============================================================================

export interface CreateOrderPayload {
  order_amount: number;
  order_currency: string;
  customer_details: {
    customer_id: string;
    customer_email: string;
    customer_phone: string;
    customer_name: string;
    customer_bank_account_number?: string;
    customer_bank_ifsc?: string;
    customer_bank_code?: number;
    customer_uid?: string;
  };
  order_id: string;
  order_meta?: {
    return_url?: string;
    notify_url?: string;
    payment_methods?: string;
    payment_methods_filters?: any;
  };
  order_note?: string;
  order_expiry_time?: string;
  order_splits?: Array<{
    vendor_id: string;
    amount?: number;
    percentage?: number;
    tags?: Record<string, any>;
  }>;
  order_tags?: Record<string, any>;
  products?: {
    one_click_checkout?: {
      enabled: boolean;
      conditions: any[];
    };
    verify_pay?: {
      enabled: boolean;
      conditions: any[];
    };
  };
  cart_details?: {
    cart_id?: string;
    cart_name?: string;
    customer_note?: string;
    shipping_charge?: number;
    customer_shipping_address?: any;
    customer_billing_address?: any;
    cart_items?: any[];
  };
  terminal_data?: {
    agent_mobile_number?: string;
    cf_terminal_id?: number;
    merchant_terminal_id?: string;
    terminal_type?: string;
  };
}

export interface CreateOrderResponse {
  cf_order_id: string;
  order_id: string;
  entity: string;
  order_currency: string;
  order_amount: number;
  order_status:
    | "ACTIVE"
    | "PAID"
    | "EXPIRED"
    | "TERMINATED"
    | "TERMINATION_REQUESTED";
  payment_session_id: string;
  order_expiry_time?: string;
  order_note?: string;
  created_at?: string;
  order_meta?: {
    return_url?: string;
    notify_url?: string;
    payment_methods?: string;
    payment_methods_filters?: any;
  };
  order_splits?: Array<{
    vendor_id: string;
    amount?: number;
    percentage?: number;
    tags?: Record<string, any>;
  }>;
  order_tags?: Record<string, any>;
  products?: {
    one_click_checkout?: {
      enabled: boolean;
      conditions: any[];
    };
    verify_pay?: {
      enabled: boolean;
      conditions: any[];
    };
  };
  cart_details?: {
    cart_id?: string;
    cart_name?: string;
    customer_note?: string;
    shipping_charge?: number;
    customer_shipping_address?: any;
    customer_billing_address?: any;
    cart_items?: any[];
  };
  terminal_data?: {
    agent_mobile_number?: string;
    cf_terminal_id?: number;
    merchant_terminal_id?: string;
    terminal_type?: string;
  };
  customer_details?: {
    customer_id: string;
    customer_email: string;
    customer_phone: string;
    customer_name: string;
    customer_bank_account_number?: string;
    customer_bank_ifsc?: string;
    customer_bank_code?: number;
    customer_uid?: string;
  };
}

// ============================================================================
// GET ORDER API TYPES
// ============================================================================

export interface GetOrderResponse {
  cf_order_id: string;
  order_id: string;
  entity: string;
  order_currency: string;
  order_amount: number;
  order_status:
    | "ACTIVE"
    | "PAID"
    | "EXPIRED"
    | "TERMINATED"
    | "TERMINATION_REQUESTED";
  payment_session_id: string;
  order_expiry_time?: string;
  order_note?: string;
  created_at?: string;
  order_meta?: {
    return_url?: string;
    notify_url?: string;
    payment_methods?: string;
    payment_methods_filters?: any;
  };
  order_splits?: Array<{
    vendor_id: string;
    amount?: number;
    percentage?: number;
    tags?: Record<string, any>;
  }>;
  order_tags?: Record<string, any>;
  products?: {
    one_click_checkout?: {
      enabled: boolean;
      conditions: any[];
    };
    verify_pay?: {
      enabled: boolean;
      conditions: any[];
    };
  };
  cart_details?: {
    cart_id?: string;
    cart_name?: string;
    customer_note?: string;
    shipping_charge?: number;
    customer_shipping_address?: any;
    customer_billing_address?: any;
    cart_items?: any[];
  };
  terminal_data?: {
    agent_mobile_number?: string;
    cf_terminal_id?: number;
    merchant_terminal_id?: string;
    terminal_type?: string;
  };
  customer_details?: {
    customer_id: string;
    customer_email: string;
    customer_phone: string;
    customer_name: string;
    customer_bank_account_number?: string;
    customer_bank_ifsc?: string;
    customer_bank_code?: number;
    customer_uid?: string;
  };
}

// ============================================================================
// PAYMENT API TYPES
// ============================================================================

export interface PaymentResponse {
  cf_payment_id: number;
  order_id: string;
  entity: string;
  payment_currency: string;
  error_details: any;
  order_amount: number;
  is_captured: boolean;
  payment_group: string;
  authorization?: {
    action: string;
    status: string;
    captured_amount: number;
    start_time: string;
    end_time: string;
    approve_by: string;
    action_reference: string;
    action_time: string;
  };
  payment_method: {
    upi?: {
      channel: string;
      upi_id: string;
    };
    card?: {
      channel: string;
      card_number: string;
      card_network: string;
      card_type: string;
      card_sub_type: string;
      card_country: string;
      card_bank_name: string;
      card_network_reference_id: string;
      instrument_id: string;
    };
    netbanking?: {
      channel: string;
      netbanking_bank_code: string;
      netbanking_bank_name: string;
    };
    wallet?: {
      channel: string;
      provider: string;
    };
    paylater?: {
      channel: string;
      provider: string;
    };
    cardless_emi?: {
      channel: string;
      provider: string;
    };
    debit_card_emi?: {
      channel: string;
      provider: string;
    };
    credit_card_emi?: {
      channel: string;
      provider: string;
    };
  };
  payment_amount: number;
  payment_time: string;
  payment_completion_time: string;
  payment_status: "SUCCESS" | "FAILED" | "PENDING" | "USER_DROPPED";
  payment_message: string;
  bank_reference: string;
  auth_id: string;
}

// ============================================================================
// PAYMENT WEBHOOK TYPES
// ============================================================================

export interface PaymentWebhookData {
  data: {
    order: {
      order_id: string;
      order_amount: number;
      order_currency: string;
      order_tags: any;
    };
    payment: {
      cf_payment_id: string;
      payment_status: "SUCCESS" | "FAILED" | "PENDING" | "USER_DROPPED";
      payment_amount: number;
      payment_currency: string;
      payment_message: string;
      payment_time: string;
      payment_completion_time?: string;
      bank_reference: string;
      auth_id: string | null;
      error_details?: any;
      authorization?: {
        action: string;
        status: string;
        captured_amount: number;
        start_time: string;
        end_time: string;
        approve_by: string;
        action_reference: string;
        action_time: string;
      };
      is_captured?: boolean;
      payment_method: {
        upi?: {
          channel: string;
          upi_id: string;
          upi_instrument: string;
          upi_instrument_number: string;
          upi_payer_ifsc: string;
          upi_payer_account_number: string;
        };
        card?: {
          channel: string;
          card_number: string;
          card_network: string;
          card_type: string;
          card_sub_type: string;
          card_country: string;
          card_bank_name: string;
          card_network_reference_id: string;
          instrument_id: string;
        };
        netbanking?: {
          channel: string;
          netbanking_bank_code: string;
          netbanking_bank_name: string;
        };
        wallet?: {
          channel: string;
          provider: string;
        };
        paylater?: {
          channel: string;
          provider: string;
        };
        cardless_emi?: {
          channel: string;
          provider: string;
        };
        debit_card_emi?: {
          channel: string;
          provider: string;
        };
        credit_card_emi?: {
          channel: string;
          provider: string;
        };
      };
      payment_group: string;
      international_payment: {
        international: boolean;
      };
      payment_surcharge: {
        payment_surcharge_service_charge: number;
        payment_surcharge_service_tax: number;
      };
    };
    customer_details: {
      customer_name: string | null;
      customer_id: string;
      customer_email: string;
      customer_phone: string;
    };
    payment_gateway_details: {
      gateway_name: string;
      gateway_order_id: string;
      gateway_payment_id: string;
      gateway_order_reference_id: string;
      gateway_settlement: string;
      gateway_status_code: string | null;
    };
    payment_offers: Array<{
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
    }>;
    terminal_details: {
      cf_terminal_id: number;
      terminal_phone: string;
    };
  };
  type:
    | "PAYMENT_SUCCESS_WEBHOOK"
    | "PAYMENT_FAILED_WEBHOOK"
    | "PAYMENT_USER_DROPPED_WEBHOOK";
  created_at: string;
}

// ============================================================================
// REFUND API TYPES
// ============================================================================

export interface CreateRefundPayload {
  refund_amount: number;
  refund_id: string;
  refund_note?: string;
  refund_splits?: Array<{
    vendor_id: string;
    amount?: number;
    percentage?: number;
    tags?: Record<string, any>;
  }>;
}

export interface CreateRefundResponse {
  cf_refund_id: string;
  refund_id: string;
  cf_payment_id: string;
  cf_order_id: string;
  refund_amount: number;
  refund_currency: string;
  refund_status: "PENDING" | "SUCCESS" | "FAILED";
  refund_note?: string;
  refund_splits?: Array<{
    vendor_id: string;
    amount?: number;
    percentage?: number;
    tags?: Record<string, any>;
  }>;
  refund_type: string;
  refund_mode: string;
  refund_speed: string;
  refund_arn?: string;
  refund_charge?: number;
  refund_processed_at?: string;
  refund_created_at: string;
  refund_status_description?: string;
}

// ============================================================================
// REFUND WEBHOOK TYPES
// ============================================================================

export interface RefundWebhookData {
  data: {
    refund: {
      cf_refund_id: string;
      refund_id: string;
      cf_payment_id: string;
      cf_order_id: string;
      refund_amount: number;
      refund_currency: string;
      refund_status: "PENDING" | "SUCCESS" | "FAILED";
      refund_note?: string;
      refund_splits?: Array<{
        vendor_id: string;
        amount?: number;
        percentage?: number;
        tags?: Record<string, any>;
      }>;
      refund_type: string;
      refund_mode: string;
      refund_speed: string;
      refund_arn?: string;
      refund_charge?: number;
      refund_processed_at?: string;
      refund_created_at: string;
      refund_status_description?: string;
    };
  };
  type: "REFUND_SUCCESS_WEBHOOK" | "REFUND_FAILED_WEBHOOK";
  created_at: string;
}

// ============================================================================
// REQUEST OPTIONS TYPES
// ============================================================================

export interface RequestOptions {
  requestId?: string;
  idempotencyKey?: string;
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export interface CashfreeError {
  type: string;
  code: string;
  message: string;
  details?: any;
}

// ============================================================================
// API CLIENT TYPES
// ============================================================================

export interface CashfreeClientConfig {
  clientId: string;
  clientSecret: string;
  environment: "sandbox" | "production";
  apiVersion?: string;
}
