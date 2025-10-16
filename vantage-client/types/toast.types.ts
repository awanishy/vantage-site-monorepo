// ============================================================================
// TOAST TYPES - React Hot Toast notification interfaces
// ============================================================================

// ============================================================================
// TOAST NOTIFICATION TYPES
// ============================================================================

export type ToastType = "success" | "error" | "warning" | "info" | "loading";

export interface ToastNotification {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
  isVisible: boolean;
  timestamp: string;
  actions?: ToastAction[];
  metadata?: Record<string, string | number | boolean>;
}

export interface ToastAction {
  label: string;
  action: () => void;
  variant?: "primary" | "secondary" | "danger";
}

// ============================================================================
// TOAST CONFIGURATION
// ============================================================================

export interface ToastConfig {
  duration: {
    success: number;
    error: number;
    warning: number;
    info: number;
    loading: number;
  };
  position:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";
  maxToasts: number;
  enableAnimations: boolean;
  enableSounds: boolean;
  enableHapticFeedback: boolean;
}

// ============================================================================
// TOAST MESSAGES
// ============================================================================

export interface ToastMessages {
  // Success Messages
  success: {
    orderCreated: string;
    paymentCompleted: string;
    pricingUpdated: string;
    guestAccountCreated: string;
    paymentSessionCreated: string;
    paymentVerified: string;
    orderCancelled: string;
    refundRequested: string;
  };

  // Error Messages
  error: {
    orderCreationFailed: string;
    paymentFailed: string;
    pricingUpdateFailed: string;
    guestAccountCreationFailed: string;
    paymentSessionFailed: string;
    paymentVerificationFailed: string;
    networkError: string;
    validationError: string;
    unknownError: string;
  };

  // Warning Messages
  warning: {
    orderExpiring: string;
    paymentSessionExpired: string;
    pricingChanged: string;
    activeOrderFound: string;
    currencyConversionWarning: string;
  };

  // Info Messages
  info: {
    checkingActiveOrders: string;
    creatingOrder: string;
    settingUpPayment: string;
    openingPaymentGateway: string;
    verifyingPayment: string;
    updatingPricing: string;
    creatingGuestAccount: string;
    processingPayment: string;
  };

  // Loading Messages
  loading: {
    creatingOrder: string;
    updatingPricing: string;
    settingUpPayment: string;
    verifyingPayment: string;
    creatingGuestAccount: string;
    processingPayment: string;
    loadingOrders: string;
    checkingActiveOrders: string;
  };
}

// ============================================================================
// TOAST CONTEXT
// ============================================================================

export interface ToastContextType {
  // State
  toasts: ToastNotification[];
  config: ToastConfig;

  // Actions
  showToast: (
    message: string,
    type: ToastType,
    options?: ToastOptions
  ) => string;
  showSuccessToast: (message: string, options?: ToastOptions) => string;
  showErrorToast: (message: string, options?: ToastOptions) => string;
  showWarningToast: (message: string, options?: ToastOptions) => string;
  showInfoToast: (message: string, options?: ToastOptions) => string;
  showLoadingToast: (message: string, options?: ToastOptions) => string;

  // Management
  dismissToast: (id: string) => void;
  dismissAllToasts: () => void;
  updateToast: (id: string, updates: Partial<ToastNotification>) => void;

  // Configuration
  updateConfig: (config: Partial<ToastConfig>) => void;
  setMessages: (messages: Partial<ToastMessages>) => void;
}

// ============================================================================
// TOAST OPTIONS
// ============================================================================

export interface ToastOptions {
  duration?: number;
  title?: string;
  actions?: ToastAction[];
  metadata?: Record<string, string | number | boolean>;
  persistent?: boolean;
  dismissible?: boolean;
  position?: ToastConfig["position"];
}

// ============================================================================
// TOAST EVENTS
// ============================================================================

export interface ToastEvent {
  type: "TOAST_SHOWN" | "TOAST_DISMISSED" | "TOAST_UPDATED" | "TOAST_CLEARED";
  data: {
    toast: ToastNotification;
    timestamp: string;
  };
}

// ============================================================================
// TOAST UTILITIES
// ============================================================================

export interface ToastUtils {
  createToastId: () => string;
  formatMessage: (
    template: string,
    variables: Record<string, string | number | boolean>
  ) => string;
  getDefaultDuration: (type: ToastType) => number;
  shouldShowToast: (type: ToastType, message: string) => boolean;
  sanitizeMessage: (message: string) => string;
}

// ============================================================================
// TOAST PRESETS
// ============================================================================

export interface ToastPresets {
  paymentSuccess: ToastNotification;
  paymentFailed: ToastNotification;
  orderCreated: ToastNotification;
  pricingUpdated: ToastNotification;
  networkError: ToastNotification;
  validationError: ToastNotification;
  loadingPayment: ToastNotification;
  loadingPricing: ToastNotification;
}

// ============================================================================
// TOAST ANIMATIONS
// ============================================================================

export interface ToastAnimation {
  enter: string;
  exit: string;
  duration: number;
  easing: string;
}

export interface ToastAnimations {
  slideIn: ToastAnimation;
  fadeIn: ToastAnimation;
  bounceIn: ToastAnimation;
  slideOut: ToastAnimation;
  fadeOut: ToastAnimation;
  bounceOut: ToastAnimation;
}

// ============================================================================
// TOAST ACCESSIBILITY
// ============================================================================

export interface ToastAccessibility {
  announceToScreenReader: boolean;
  role: string;
  ariaLive: "polite" | "assertive" | "off";
  ariaLabel: string;
  keyboardNavigation: boolean;
  focusManagement: boolean;
}

// ============================================================================
// TOAST ERROR CODES
// ============================================================================

export type ToastErrorCode =
  | "INVALID_MESSAGE"
  | "INVALID_TYPE"
  | "INVALID_DURATION"
  | "TOAST_LIMIT_EXCEEDED"
  | "ANIMATION_FAILED"
  | "ACCESSIBILITY_ERROR"
  | "UNKNOWN_ERROR";
