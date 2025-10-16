// ============================================================================
// CHECKOUT TYPES - Client-side checkout form interfaces
// ============================================================================

// ============================================================================
// CHECKOUT FORM DATA
// ============================================================================

export interface CheckoutFormData {
  // Personal Details
  name: string;
  email: string;
  phone: string;

  // Program Selection
  programId: string;
  programName: string;
  programSlug: string;

  // Currency & Pricing
  selectedCurrency: string;
  programCurrency: string;
  orderAmount: number;
  fx?: {
    fromCurrency: string;
    toCurrency: string;
    rate: number;
    conversionDate: string;
  };

  // Additional Info
  orderNote?: string;
  termsAccepted: boolean;
  privacyAccepted: boolean;

  // Metadata
  source: "authenticated_user" | "guest_user";
  pricingVersion: string;
}

export interface GuestCheckoutFormData extends CheckoutFormData {
  source: "guest_user";
  // Guest-specific fields
  createAccount: boolean;
  password?: string;
  confirmPassword?: string;
}

export interface AuthCheckoutFormData extends CheckoutFormData {
  source: "authenticated_user";
  // Auth user gets pre-filled data
  userId: string;
  userEmail: string;
  userName: string;
  userPhone: string;
}

// ============================================================================
// CHECKOUT STEPS
// ============================================================================

export type CheckoutStep =
  | "personal-details"
  | "program-selection"
  | "currency-selection"
  | "pricing-display"
  | "payment-method"
  | "payment-processing"
  | "payment-success"
  | "payment-failed";

export type PaymentFlowState =
  | "idle"
  | "updating-pricing"
  | "creating-guest-user"
  | "creating-order"
  | "creating-session"
  | "payment-modal-open"
  | "verifying-payment"
  | "success"
  | "failed"
  | "cancelled";

export interface CheckoutStepData {
  step: CheckoutStep;
  isCompleted: boolean;
  isActive: boolean;
  isDisabled: boolean;
  data?: Record<string, unknown>;
}

// ============================================================================
// CHECKOUT VALIDATION
// ============================================================================

export interface CheckoutValidation {
  isValid: boolean;
  errors: CheckoutFieldError[];
  warnings: CheckoutFieldWarning[];
}

export interface CheckoutFieldError {
  field: string;
  message: string;
  code: string;
}

export interface CheckoutFieldWarning {
  field: string;
  message: string;
  code: string;
}

// ============================================================================
// CHECKOUT STATE
// ============================================================================

export interface CheckoutState {
  currentStep: CheckoutStep;
  steps: CheckoutStepData[];
  formData: CheckoutFormData;
  validation: CheckoutValidation;
  isLoading: boolean;
  error: string | null;
  isDirty: boolean;
  isSubmitting: boolean;
}

// ============================================================================
// CURRENCY SELECTION
// ============================================================================

export interface CurrencyOption {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  isPopular: boolean;
}

export interface CurrencySelection {
  selected: string;
  options: CurrencyOption[];
  isUpdating: boolean;
  lastUpdated: string | null;
}

// ============================================================================
// PROGRAM SELECTION
// ============================================================================

export interface ProgramOption {
  programId: string;
  title: string;
  slug: string;
  description: string;
  duration: string;
  level: string;
  pricing: {
    currency: string;
    tuition: number;
    taxesIncluded: boolean;
  };
  isPopular: boolean;
  isRecommended: boolean;
}

export interface ProgramSelection {
  selected: string | null;
  options: ProgramOption[];
  isLoading: boolean;
  error: string | null;
}

// ============================================================================
// PAYMENT METHOD SELECTION
// ============================================================================

export interface PaymentMethodOption {
  id: string;
  name: string;
  type: "upi" | "card" | "netbanking" | "wallet" | "paylater" | "emi";
  icon: string;
  isAvailable: boolean;
  processingFee?: number;
  description?: string;
}

export interface PaymentMethodSelection {
  selected: string | null;
  options: PaymentMethodOption[];
  isLoading: boolean;
  error: string | null;
}

// ============================================================================
// CHECKOUT CONFIRMATION
// ============================================================================

export interface CheckoutConfirmation {
  orderId: string;
  orderNumber: string;
  paymentSessionId: string;
  amount: number;
  currency: string;
  status: string;
  expiresAt: string;
  paymentUrl?: string;
  isConfirmed: boolean;
  confirmedAt: string | null;
}

// ============================================================================
// CHECKOUT ERRORS
// ============================================================================

export interface CheckoutError {
  code: string;
  message: string;
  field?: string;
  details?: Record<string, unknown>;
  isRetryable: boolean;
  retryAfter?: number;
}

export type CheckoutErrorCode =
  | "VALIDATION_ERROR"
  | "NETWORK_ERROR"
  | "PAYMENT_FAILED"
  | "ORDER_CREATION_FAILED"
  | "PAYMENT_SESSION_FAILED"
  | "CURRENCY_CONVERSION_FAILED"
  | "PROGRAM_NOT_FOUND"
  | "USER_NOT_FOUND"
  | "ACTIVE_ORDER_EXISTS"
  | "PAYMENT_EXPIRED"
  | "INSUFFICIENT_FUNDS"
  | "CARD_DECLINED"
  | "UNKNOWN_ERROR";
