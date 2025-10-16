// ============================================================================
// TYPES INDEX - Export all client-side types
// ============================================================================

// API Types
export * from "./api.types";

// Checkout Types
export * from "./checkout.types";

// Order Types (excluding conflicting types)
export type {
  Order,
  CreateOrderRequest,
  CreateOrderResponse,
  GetOrderResponse,
  GetMyOrdersResponse,
  CheckActiveOrdersRequest,
  CheckActiveOrdersResponse,
  GuestUser,
  CreateGuestUserRequest,
  CreateGuestUserResponse,
  CreateGuestOrderRequest,
  CreateGuestOrderResponse,
  OrderStatus,
  OrderFilters,
  OrderSearchParams,
} from "./order.types";

// Payment Types (excluding conflicting types)
export type {
  PaymentSession,
  Payment,
  PaymentStatus,
  CreatePaymentSessionRequest,
  CreatePaymentSessionResponse,
  VerifyPaymentRequest,
  VerifyPaymentResponse,
  CreateRefundRequest,
  CreateRefundResponse,
  GetRefundResponse,
  WebhookRequest,
  WebhookResponse,
  AdminStatsResponse,
  PaymentError,
  PaymentSuccess,
  PaymentResponse,
} from "./payment.types";

// Pricing Types (excluding conflicting types)
export type {
  GetPricingRequest,
  GetPricingResponse,
  PricingState,
  CurrencyConversion,
  CurrencyRate,
  PricingCalculation,
  PricingOptions,
  PricingValidation,
  PricingCacheEntry,
  PricingUpdateEvent,
  PricingErrorEvent,
  PricingConfig,
  PricingUtils,
  PricingErrorCode,
} from "./pricing.types";

// Toast Types
export * from "./toast.types";

// ============================================================================
// COMMON TYPE UTILITIES
// ============================================================================

export type Status = "idle" | "loading" | "success" | "error";

export type LoadingState<T = Record<string, unknown>> = {
  isLoading: boolean;
  error: string | null;
  data: T | null;
};

export type PaginationState = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

// ============================================================================
// FORM UTILITIES
// ============================================================================

export interface FormField<T = string | number | boolean> {
  value: T;
  error: string | null;
  touched: boolean;
  dirty: boolean;
}

export interface FormState<T = Record<string, unknown>> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  dirty: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
}

// ============================================================================
// COMPONENT PROPS
// ============================================================================

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
  "data-testid"?: string;
}

export interface LoadingComponentProps extends BaseComponentProps {
  isLoading: boolean;
  loadingMessage?: string;
  error?: string | null;
  onRetry?: () => void;
}

export interface ErrorComponentProps extends BaseComponentProps {
  error: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type Required<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type NonNullable<T> = T extends null | undefined ? never : T;

export type ValueOf<T> = T[keyof T];

export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

// ============================================================================
// EVENT TYPES
// ============================================================================

export interface BaseEvent {
  type: string;
  timestamp: string;
  source: string;
}

export interface PaymentEvent extends BaseEvent {
  type:
    | "payment_started"
    | "payment_completed"
    | "payment_failed"
    | "payment_cancelled";
  data: {
    orderId: string;
    amount: number;
    currency: string;
    paymentMethod?: string;
  };
}

export interface OrderEvent extends BaseEvent {
  type: "order_created" | "order_updated" | "order_cancelled" | "order_expired";
  data: {
    orderId: string;
    orderNumber: string;
    status: string;
    amount: number;
    currency: string;
  };
}

export interface PricingEvent extends BaseEvent {
  type: "pricing_updated" | "currency_changed" | "pricing_error";
  data: {
    programId: string;
    currency: string;
    amount: number;
    previousAmount?: number;
  };
}

// ============================================================================
// CONFIGURATION TYPES
// ============================================================================

export interface AppConfig {
  api: {
    baseURL: string;
    timeout: number;
    retries: number;
  };
  payment: {
    currency: string;
    supportedCurrencies: string[];
    debounceDelay: number;
  };
  toast: {
    duration: number;
    position: string;
    maxToasts: number;
  };
  features: {
    realTimePricing: boolean;
    guestCheckout: boolean;
    paymentRetry: boolean;
    orderHistory: boolean;
  };
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const CURRENCIES = {
  INR: { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳" },
  USD: { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
  EUR: { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  GBP: { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
} as const;

export const ORDER_STATUS = {
  ACTIVE: "ACTIVE",
  PAID: "PAID",
  EXPIRED: "EXPIRED",
  CANCELLED: "CANCELLED",
} as const;

export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
  USER_DROPPED: "USER_DROPPED",
} as const;

export const TOAST_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
  LOADING: "loading",
} as const;
