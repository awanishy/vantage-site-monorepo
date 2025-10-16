// ============================================================================
// API TYPES - Client-side API response wrappers and utilities
// ============================================================================

// ============================================================================
// API RESPONSE WRAPPERS
// ============================================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  code?: string;
  details?: Record<string, unknown>;
  timestamp: string;
  requestId?: string;
  // Auth-specific fields
  requiresVerification?: boolean;
  email?: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    phone?: string;
    userType?: string;
    role?: string;
    isActive?: boolean;
    isVerified?: boolean;
  };
}

export interface ApiSuccess<T = unknown> extends ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiError extends ApiResponse {
  success: false;
  error: string;
  code?: string;
  details?: Record<string, unknown>;
}

// ============================================================================
// API REQUEST CONFIGURATION
// ============================================================================

export interface ApiRequestConfig {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  url: string;
  headers?: Record<string, string>;
  body?: string | FormData | Record<string, unknown>;
  params?: Record<string, string | number | boolean>;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export interface ApiRequestOptions {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  showLoading?: boolean;
  showError?: boolean;
  showSuccess?: boolean;
  loadingMessage?: string;
  errorMessage?: string;
  successMessage?: string;
}

// ============================================================================
// API ERROR HANDLING
// ============================================================================

export interface ApiErrorDetails {
  code: string;
  message: string;
  field?: string;
  value?: string | number | boolean | null;
  constraint?: string;
  stack?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  code: string;
  details: ApiErrorDetails[];
  timestamp: string;
  requestId: string;
  path: string;
  method: string;
}

// ============================================================================
// API PAGINATION
// ============================================================================

export interface ApiPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  nextPage?: number;
  prevPage?: number;
}

export interface PaginatedResponse<T = Record<string, unknown>>
  extends ApiSuccess<T[]> {
  pagination: ApiPagination;
}

// ============================================================================
// API LOADING STATES
// ============================================================================

export interface ApiLoadingState {
  isLoading: boolean;
  isInitialLoading: boolean;
  isRefreshing: boolean;
  isMutating: boolean;
  loadingMessage?: string;
  progress?: number;
}

// ============================================================================
// API CACHE
// ============================================================================

export interface ApiCacheEntry<T = unknown> {
  key: string;
  data: T;
  timestamp: number;
  ttl: number;
  isStale: boolean;
  etag?: string;
  lastModified?: string;
}

export interface ApiCacheConfig {
  enabled: boolean;
  ttl: number;
  maxSize: number;
  strategy: "memory" | "localStorage" | "sessionStorage";
  invalidateOnMutation: boolean;
}

// ============================================================================
// API INTERCEPTORS
// ============================================================================

export interface ApiInterceptor {
  request?: (
    config: ApiRequestConfig
  ) => ApiRequestConfig | Promise<ApiRequestConfig>;
  response?: (response: ApiResponse) => ApiResponse | Promise<ApiResponse>;
  error?: (error: ApiError) => ApiError | Promise<ApiError>;
}

// ============================================================================
// API CLIENT CONFIGURATION
// ============================================================================

export interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  retryDelay: number;
  headers: Record<string, string>;
  interceptors: ApiInterceptor[];
  cache: ApiCacheConfig;
  errorHandling: {
    showToasts: boolean;
    logErrors: boolean;
    retryOnError: boolean;
  };
}

// ============================================================================
// API UTILITIES
// ============================================================================

export interface ApiUtils {
  buildUrl: (
    endpoint: string,
    params?: Record<string, string | number | boolean>
  ) => string;
  buildHeaders: (
    customHeaders?: Record<string, string>
  ) => Record<string, string>;
  serializeParams: (
    params: Record<string, string | number | boolean>
  ) => string;
  parseError: (error: Error | Record<string, unknown>) => ApiError;
  isNetworkError: (error: Error | Record<string, unknown>) => boolean;
  isTimeoutError: (error: Error | Record<string, unknown>) => boolean;
  isRetryableError: (error: Error | Record<string, unknown>) => boolean;
  getErrorMessage: (error: Error | Record<string, unknown>) => string;
  getErrorCode: (error: Error | Record<string, unknown>) => string;
}

// ============================================================================
// API HOOKS
// ============================================================================

export interface UseApiOptions<T = Record<string, unknown>> {
  immediate?: boolean;
  retry?: boolean;
  retryDelay?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
  onFinally?: () => void;
  dependencies?: (string | number | boolean)[];
}

export interface UseApiReturn<T = Record<string, unknown>> {
  data: T | null;
  error: ApiError | null;
  loading: ApiLoadingState;
  execute: (...args: (string | number | boolean)[]) => Promise<T>;
  reset: () => void;
  refresh: () => Promise<T>;
}

// ============================================================================
// API ENDPOINTS
// ============================================================================

export interface ApiEndpoints {
  // Payment endpoints
  payments: {
    pricing: string;
    orders: string;
    orderById: (id: string) => string;
    checkActiveOrders: string;
    createPaymentSession: (orderId: string) => string;
    verifyPayment: (orderId: string) => string;
    myOrders: string;
    refunds: string;
    refundById: (id: string) => string;
  };

  // Guest endpoints
  guest: {
    createUser: string;
    createOrder: string;
    createPaymentSession: (orderId: string) => string;
  };

  // Admin endpoints
  admin: {
    stats: string;
  };
}

// ============================================================================
// API VALIDATION
// ============================================================================

export interface ApiValidation {
  validateRequest: (
    data: Record<string, unknown>,
    schema: Record<string, unknown>
  ) => boolean;
  validateResponse: (
    data: Record<string, unknown>,
    schema: Record<string, unknown>
  ) => boolean;
  sanitizeData: (data: Record<string, unknown>) => Record<string, unknown>;
  transformData: <T, U>(data: T, transformer: (data: T) => U) => U;
}

// ============================================================================
// API MONITORING
// ============================================================================

export interface ApiMetrics {
  requestCount: number;
  successCount: number;
  errorCount: number;
  averageResponseTime: number;
  lastRequestTime: string | null;
  lastErrorTime: string | null;
}

export interface ApiMonitoring {
  metrics: ApiMetrics;
  trackRequest: (config: ApiRequestConfig, startTime: number) => void;
  trackResponse: (response: ApiResponse, endTime: number) => void;
  trackError: (error: ApiError, endTime: number) => void;
  getMetrics: () => ApiMetrics;
  resetMetrics: () => void;
}

// ============================================================================
// API ERROR CODES
// ============================================================================

export type ApiErrorCode =
  | "NETWORK_ERROR"
  | "TIMEOUT_ERROR"
  | "VALIDATION_ERROR"
  | "AUTHENTICATION_ERROR"
  | "AUTHORIZATION_ERROR"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMIT_EXCEEDED"
  | "SERVER_ERROR"
  | "UNKNOWN_ERROR";
