// ============================================================================
// API UTILITIES - Shared functions for Next.js API routes
// ============================================================================

// ============================================================================
// TYPES
// ============================================================================

export interface ApiError {
  success: false;
  error: string;
  code: string;
  details?: string;
  timestamp: string;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  message: string;
  timestamp: string;
}

export type ApiResponse<T> = ApiError | ApiSuccess<T>;

// ============================================================================
// ERROR HANDLING UTILITIES
// ============================================================================

/**
 * Creates a standardized error response
 */
export function createErrorResponse(
  error: unknown,
  code: string,
  message: string,
  details?: string
): ApiError {
  const errorMessage = extractErrorDetails(error);

  return {
    success: false,
    error: errorMessage,
    code,
    details,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Creates a standardized success response
 */
export function createSuccessResponse<T>(
  data: T,
  message: string
): ApiSuccess<T> {
  return {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Extracts error details from unknown error types
 */
export function extractErrorDetails(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }

  return "An unknown error occurred";
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Validates required fields in request body
 */
export function validateRequiredFields(
  body: Record<string, unknown> | object,
  requiredFields: string[]
): string[] {
  const errors: string[] = [];

  for (const field of requiredFields) {
    const value = (body as Record<string, unknown>)[field];
    if (!value || (typeof value === "string" && !value.trim())) {
      errors.push(`${field} is required`);
    }
  }

  return errors;
}

/**
 * Validates email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates phone number format (international)
 */
export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
}

/**
 * Validates string length
 */
export function validateStringLength(
  value: string,
  minLength: number,
  maxLength: number
): boolean {
  return value.length >= minLength && value.length <= maxLength;
}

// ============================================================================
// REQUEST/RESPONSE UTILITIES
// ============================================================================

/**
 * Logs API request details
 */
export function logRequest(method: string, url: string, body?: unknown): void {
  console.log(`[API] ${method} ${url}`, body ? { body } : "");
}

/**
 * Logs API response details
 */
export function logResponse(
  status: number,
  message: string,
  data?: unknown
): void {
  console.log(`[API] Response ${status}: ${message}`, data ? { data } : "");
}

/**
 * Logs API error details
 */
export function logError(error: unknown, context: string): void {
  console.error(`[API] Error in ${context}:`, error);
}

// ============================================================================
// COMMON VALIDATION PATTERNS
// ============================================================================

/**
 * Common validation patterns for different request types
 */
export const ValidationPatterns = {
  // User authentication
  login: ["email", "password"] as string[],
  signup: ["email", "password", "name"] as string[],

  // Guest user
  guestUser: ["email", "name"] as string[],

  // Order creation
  createOrder: ["programId", "selectedCurrency"] as string[],
  createGuestOrder: [
    "programId",
    "selectedCurrency",
    "guestUserId",
  ] as string[],

  // Payment
  createPaymentSession: ["orderId"] as string[],
  verifyPayment: ["orderId"] as string[],

  // Pricing
  getPricing: ["programId", "selectedCurrency"] as string[],

  // Refund
  createRefund: ["refundAmount", "refundId"] as string[],
};

// ============================================================================
// COMMON ERROR CODES
// ============================================================================

export const ErrorCodes = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  AUTHENTICATION_ERROR: "AUTHENTICATION_ERROR",
  AUTHORIZATION_ERROR: "AUTHORIZATION_ERROR",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  API_ERROR: "API_ERROR",
  USER_EXISTS: "USER_EXISTS",
} as const;

// ============================================================================
// COMMON SUCCESS MESSAGES
// ============================================================================

export const SuccessMessages = {
  ORDER_CREATED: "Order created successfully",
  ORDER_RETRIEVED: "Order retrieved successfully",
  PAYMENT_SESSION_CREATED: "Payment session created successfully",
  PAYMENT_VERIFIED: "Payment verified successfully",
  GUEST_USER_CREATED: "Guest user created successfully",
  GUEST_ORDER_CREATED: "Guest order created successfully",
  PRICING_RETRIEVED: "Pricing retrieved successfully",
  ORDERS_RETRIEVED: "Orders retrieved successfully",
  REFUND_CREATED: "Refund created successfully",
  REFUND_RETRIEVED: "Refund retrieved successfully",
  USER_AUTHENTICATED: "User authenticated successfully",
  LOGIN_SUCCESSFUL: "Login successful",
  PROGRAM_RETRIEVED: "Program retrieved successfully",
} as const;
