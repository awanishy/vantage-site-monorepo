// ============================================================================
// PRICING TYPES - Real-time pricing and currency conversion interfaces
// ============================================================================

// ============================================================================
// PRICING REQUESTS & RESPONSES
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
// PRICING STATE
// ============================================================================

export interface PricingState {
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
  lastUpdated: string;
  isStale: boolean;
}

// ============================================================================
// CURRENCY CONVERSION
// ============================================================================

export interface CurrencyConversion {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  conversionDate: string;
  isLive: boolean;
  source: "api" | "cache" | "fallback";
}

export interface CurrencyRate {
  from: string;
  to: string;
  rate: number;
  timestamp: number;
  source: string;
}

// ============================================================================
// PRICING CALCULATION
// ============================================================================

export interface PricingCalculation {
  baseAmount: number;
  baseCurrency: string;
  convertedAmount: number;
  convertedCurrency: string;
  conversionRate: number;
  fees: {
    processingFee: number;
    taxAmount: number;
    totalFees: number;
  };
  breakdown: {
    tuition: number;
    taxes: number;
    fees: number;
    total: number;
  };
  isEstimated: boolean;
  lastUpdated: string;
}

// ============================================================================
// PRICING OPTIONS
// ============================================================================

export interface PricingOptions {
  programId: string;
  currencies: string[];
  defaultCurrency: string;
  supportedCurrencies: CurrencyOption[];
  conversionEnabled: boolean;
  realTimeUpdates: boolean;
  debounceDelay: number; // in milliseconds
}

export interface CurrencyOption {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  isPopular: boolean;
  isSupported?: boolean;
  conversionRate?: number;
}

// ============================================================================
// PRICING VALIDATION
// ============================================================================

export interface PricingValidation {
  isValid: boolean;
  errors: PricingError[];
  warnings: PricingWarning[];
}

export interface PricingError {
  field: string;
  message: string;
  code: string;
}

export interface PricingWarning {
  field: string;
  message: string;
  code: string;
}

// ============================================================================
// PRICING CACHE (for performance, but we're not using it per your spec)
// ============================================================================

export interface PricingCacheEntry {
  key: string;
  data: PricingState;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
  isStale: boolean;
}

// ============================================================================
// PRICING EVENTS
// ============================================================================

export interface PricingUpdateEvent {
  type: "PRICING_UPDATED" | "PRICING_ERROR" | "CURRENCY_CHANGED";
  data: {
    programId: string;
    currency: string;
    pricing?: PricingState;
    error?: string;
    timestamp: string;
  };
}

export interface PricingErrorEvent {
  type: "PRICING_ERROR";
  data: {
    programId: string;
    currency: string;
    error: string;
    code: string;
    timestamp: string;
    isRetryable: boolean;
  };
}

// ============================================================================
// PRICING CONFIGURATION
// ============================================================================

export interface PricingConfig {
  // API Configuration
  apiEndpoint: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
  
  // Debouncing Configuration
  debounceDelay: number; // 500ms as per your spec
  maxDebounceDelay: number;
  
  // Currency Configuration
  defaultCurrency: string;
  supportedCurrencies: string[];
  popularCurrencies: string[];
  
  // Real-time Configuration
  realTimeUpdates: boolean;
  noCaching: boolean; // true as per your spec
  
  // Error Handling
  showErrors: boolean;
  autoRetry: boolean;
  maxRetries: number;
}

// ============================================================================
// PRICING UTILITIES
// ============================================================================

export interface PricingUtils {
  formatCurrency: (amount: number, currency: string) => string;
  formatAmount: (amount: number, currency: string, locale?: string) => string;
  calculateConversion: (amount: number, fromCurrency: string, toCurrency: string, rate: number) => number;
  validateCurrency: (currency: string) => boolean;
  getCurrencySymbol: (currency: string) => string;
  getCurrencyName: (currency: string) => string;
}

// ============================================================================
// PRICING ERROR CODES
// ============================================================================

export type PricingErrorCode = 
  | "INVALID_PROGRAM_ID"
  | "INVALID_CURRENCY"
  | "CONVERSION_FAILED"
  | "API_ERROR"
  | "NETWORK_ERROR"
  | "RATE_LIMIT_EXCEEDED"
  | "INVALID_RESPONSE"
  | "TIMEOUT_ERROR"
  | "UNKNOWN_ERROR";
