"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
} from "react";
import { toast } from "react-hot-toast";
import {
  Order,
  PaymentSession,
  GuestUser,
  CreateOrderRequest,
  CreateGuestOrderRequest,
  CreateGuestUserRequest,
  PricingState,
  PaymentFlowState,
  ToastType,
  ApiResponse,
  CheckActiveOrdersResponse,
  GetMyOrdersResponse,
  VerifyPaymentResponse,
} from "@/types";

interface GuestUserResponse extends ApiResponse<GuestUser> {
  redirectTo?: string;
}

// ============================================================================
// PAYMENT CONTEXT INTERFACE
// ============================================================================

interface PaymentContextType {
  // State
  currentOrder: Order | null;
  paymentSession: PaymentSession | null;
  isLoading: boolean;
  error: string | null;

  // Pricing State (real-time, no cache)
  pricing: PricingState | null;
  selectedCurrency: string;
  isPricingLoading: boolean;
  pricingError: string | null;

  // Payment Flow State
  paymentFlowState: PaymentFlowState;

  // Actions
  createOrder: (data: CreateOrderRequest) => Promise<Order>;
  createPaymentSession: (orderId: string) => Promise<PaymentSession>; // On-demand
  verifyPayment: (orderId: string) => Promise<VerifyPaymentResponse>;
  openPaymentModal: (sessionId: string) => void; // Cashfree hosted in modal
  closePaymentModal: () => void;

  // Guest flow
  createGuestUser: (data: CreateGuestUserRequest) => Promise<GuestUser | void>; // Immediate creation
  createGuestOrder: (data: CreateGuestOrderRequest) => Promise<Order>;
  createGuestPaymentSession: (
    orderId: string,
    email: string
  ) => Promise<PaymentSession>; // On-demand

  // Order management
  checkActiveOrders: (data: {
    programId: string;
    selectedCurrency: string;
  }) => Promise<CheckActiveOrdersResponse>;
  getMyOrders: (
    filters?: Record<string, unknown>
  ) => Promise<GetMyOrdersResponse>;
  getOrder: (orderId: string) => Promise<Order>;

  // Real-time pricing (no cache)
  updatePricing: (programId: string, currency: string) => Promise<void>;
  getPricing: (programId: string, currency: string) => Promise<PricingState>;

  // Toast notifications
  showToast: (message: string, type: ToastType) => void;
  showSuccessToast: (message: string) => void;
  showErrorToast: (message: string) => void;
  showLoadingToast: (message: string) => void;

  // State management
  setCurrentOrder: (order: Order | null) => void;
  setPaymentSession: (session: PaymentSession | null) => void;
  setError: (error: string | null) => void;
  setPricing: (pricing: PricingState | null) => void;
  setSelectedCurrency: (currency: string) => void;
  setPaymentFlowState: (state: PaymentFlowState) => void;
}

// ============================================================================
// PAYMENT STATE INTERFACE
// ============================================================================

interface PaymentState {
  currentOrder: Order | null;
  paymentSession: PaymentSession | null;
  isLoading: boolean;
  error: string | null;
  pricing: PricingState | null;
  selectedCurrency: string;
  isPricingLoading: boolean;
  pricingError: string | null;
  paymentFlowState: PaymentFlowState;
}

// ============================================================================
// PAYMENT ACTIONS
// ============================================================================

type PaymentAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_CURRENT_ORDER"; payload: Order | null }
  | { type: "SET_PAYMENT_SESSION"; payload: PaymentSession | null }
  | { type: "SET_PRICING"; payload: PricingState | null }
  | { type: "SET_SELECTED_CURRENCY"; payload: string }
  | { type: "SET_PRICING_LOADING"; payload: boolean }
  | { type: "SET_PRICING_ERROR"; payload: string | null }
  | { type: "SET_PAYMENT_FLOW_STATE"; payload: PaymentFlowState }
  | { type: "RESET_PAYMENT_STATE" };

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: PaymentState = {
  currentOrder: null,
  paymentSession: null,
  isLoading: false,
  error: null,
  pricing: null,
  selectedCurrency: "INR",
  isPricingLoading: false,
  pricingError: null,
  paymentFlowState: "idle",
};

// ============================================================================
// PAYMENT REDUCER
// ============================================================================

function paymentReducer(
  state: PaymentState,
  action: PaymentAction
): PaymentState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_CURRENT_ORDER":
      return { ...state, currentOrder: action.payload };
    case "SET_PAYMENT_SESSION":
      return { ...state, paymentSession: action.payload };
    case "SET_PRICING":
      return { ...state, pricing: action.payload };
    case "SET_SELECTED_CURRENCY":
      return { ...state, selectedCurrency: action.payload };
    case "SET_PRICING_LOADING":
      return { ...state, isPricingLoading: action.payload };
    case "SET_PRICING_ERROR":
      return { ...state, pricingError: action.payload };
    case "SET_PAYMENT_FLOW_STATE":
      return { ...state, paymentFlowState: action.payload };
    case "RESET_PAYMENT_STATE":
      return initialState;
    default:
      return state;
  }
}

// ============================================================================
// PAYMENT CONTEXT
// ============================================================================

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

// ============================================================================
// PAYMENT PROVIDER COMPONENT
// ============================================================================

interface PaymentProviderProps {
  children: ReactNode;
}

export function PaymentProvider({ children }: PaymentProviderProps) {
  const [state, dispatch] = useReducer(paymentReducer, initialState);

  // ============================================================================
  // TOAST NOTIFICATIONS
  // ============================================================================

  const showToast = useCallback((message: string, type: ToastType) => {
    switch (type) {
      case "success":
        toast.success(message);
        break;
      case "error":
        toast.error(message);
        break;
      case "warning":
        toast(message, { icon: "⚠️" });
        break;
      case "info":
        toast(message, { icon: "ℹ️" });
        break;
      case "loading":
        toast.loading(message);
        break;
    }
  }, []);

  const showSuccessToast = useCallback(
    (message: string) => {
      showToast(message, "success");
    },
    [showToast]
  );

  const showErrorToast = useCallback(
    (message: string) => {
      showToast(message, "error");
    },
    [showToast]
  );

  const showLoadingToast = useCallback(
    (message: string) => {
      showToast(message, "loading");
    },
    [showToast]
  );

  // ============================================================================
  // API CALLS
  // ============================================================================

  const apiCall = useCallback(
    async <T,>(
      endpoint: string,
      options: RequestInit = {}
    ): Promise<ApiResponse<T>> => {
      const response = await fetch(endpoint, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();
      return data as ApiResponse<T>;
    },
    []
  );

  // ============================================================================
  // PRICING OPERATIONS
  // ============================================================================

  const updatePricing = useCallback(
    async (programId: string, currency: string) => {
      try {
        dispatch({ type: "SET_PRICING_LOADING", payload: true });
        dispatch({ type: "SET_PRICING_ERROR", payload: null });

        const response = await apiCall<PricingState>("/api/payments/pricing", {
          method: "POST",
          body: JSON.stringify({ programId, selectedCurrency: currency }),
        });

        if (response.success && response.data) {
          dispatch({ type: "SET_PRICING", payload: response.data });
          dispatch({ type: "SET_SELECTED_CURRENCY", payload: currency });
          showSuccessToast("Pricing updated successfully");
        } else {
          throw new Error(response.error || "Failed to update pricing");
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to update pricing";
        dispatch({ type: "SET_PRICING_ERROR", payload: errorMessage });
        showErrorToast(errorMessage);
        throw error;
      } finally {
        dispatch({ type: "SET_PRICING_LOADING", payload: false });
      }
    },
    [apiCall, showSuccessToast, showErrorToast]
  );

  const getPricing = useCallback(
    async (programId: string, currency: string): Promise<PricingState> => {
      const response = await apiCall<PricingState>("/api/payments/pricing", {
        method: "POST",
        body: JSON.stringify({ programId, selectedCurrency: currency }),
      });

      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.error || "Failed to get pricing");
      }
    },
    [apiCall]
  );

  // ============================================================================
  // ORDER OPERATIONS
  // ============================================================================

  const createOrder = useCallback(
    async (data: CreateOrderRequest): Promise<Order> => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        dispatch({ type: "SET_ERROR", payload: null });
        dispatch({ type: "SET_PAYMENT_FLOW_STATE", payload: "creating-order" });

        showLoadingToast("Creating your order...");

        const response = await apiCall<Order>("/api/payments/orders", {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (response.success && response.data) {
          dispatch({ type: "SET_CURRENT_ORDER", payload: response.data });
          showSuccessToast("Order created successfully!");
          return response.data;
        } else {
          throw new Error(response.error || "Failed to create order");
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to create order";
        dispatch({ type: "SET_ERROR", payload: errorMessage });
        showErrorToast(errorMessage);
        throw error;
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [apiCall, showLoadingToast, showSuccessToast, showErrorToast]
  );

  // ============================================================================
  // PAYMENT SESSION OPERATIONS
  // ============================================================================

  const createPaymentSession = useCallback(
    async (orderId: string): Promise<PaymentSession> => {
      console.log(
        "PaymentProvider: createPaymentSession called with orderId:",
        orderId
      );
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        dispatch({ type: "SET_ERROR", payload: null });
        dispatch({
          type: "SET_PAYMENT_FLOW_STATE",
          payload: "creating-session",
        });

        showLoadingToast("Setting up payment...");

        console.log(
          "PaymentProvider: Making API call to create payment session"
        );
        const response = await apiCall<PaymentSession>(
          `/api/payments/orders/${orderId}/payment-session`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        console.log("PaymentProvider: API response:", response);

        if (response.success && response.data) {
          dispatch({ type: "SET_PAYMENT_SESSION", payload: response.data });
          showSuccessToast("Payment session created successfully!");
          return response.data;
        } else {
          throw new Error(response.error || "Failed to create payment session");
        }
      } catch (error: unknown) {
        console.error("PaymentProvider: createPaymentSession error:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to create payment session";
        dispatch({ type: "SET_ERROR", payload: errorMessage });
        showErrorToast(errorMessage);
        throw error;
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [apiCall, showLoadingToast, showSuccessToast, showErrorToast]
  );

  const verifyPayment = useCallback(
    async (orderId: string): Promise<VerifyPaymentResponse> => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        dispatch({ type: "SET_ERROR", payload: null });
        dispatch({
          type: "SET_PAYMENT_FLOW_STATE",
          payload: "verifying-payment",
        });

        showLoadingToast("Verifying payment...");

        const response = await apiCall<VerifyPaymentResponse>(
          `/api/payments/orders/${orderId}/verify`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        if (response.success && response.data) {
          showSuccessToast("Payment verified successfully!");
          // Return the full response object, not just response.data
          return response as VerifyPaymentResponse;
        } else {
          throw new Error(response.error || "Failed to verify payment");
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to verify payment";
        dispatch({ type: "SET_ERROR", payload: errorMessage });
        showErrorToast(errorMessage);
        throw error;
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [apiCall, showLoadingToast, showSuccessToast, showErrorToast]
  );

  // ============================================================================
  // GUEST OPERATIONS
  // ============================================================================

  const createGuestUser = useCallback(
    async (data: CreateGuestUserRequest): Promise<GuestUser | void> => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        dispatch({ type: "SET_ERROR", payload: null });
        dispatch({
          type: "SET_PAYMENT_FLOW_STATE",
          payload: "creating-guest-user",
        });

        showLoadingToast("Creating guest account...");

        const response = (await apiCall<GuestUser>("/api/payments/guest/user", {
          method: "POST",
          body: JSON.stringify(data),
        })) as GuestUserResponse;

        if (response.success && response.data) {
          showSuccessToast("Guest account created successfully!");
          return response.data;
        } else {
          // Handle user already exists case
          if (response.code === "USER_EXISTS" && response.redirectTo) {
            showToast(
              "An account with this email already exists. Redirecting to sign in...",
              "info"
            );
            window.location.href = response.redirectTo;
            return;
          }
          throw new Error(response.error || "Failed to create guest user");
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to create guest user";
        dispatch({ type: "SET_ERROR", payload: errorMessage });
        showErrorToast(errorMessage);
        throw error;
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [apiCall, showLoadingToast, showSuccessToast, showErrorToast, showToast]
  );

  const createGuestOrder = useCallback(
    async (data: CreateGuestOrderRequest): Promise<Order> => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        dispatch({ type: "SET_ERROR", payload: null });
        dispatch({ type: "SET_PAYMENT_FLOW_STATE", payload: "creating-order" });

        showLoadingToast("Creating your order...");

        const response = await apiCall<Order>("/api/payments/guest/order", {
          method: "POST",
          body: JSON.stringify(data),
        });

        if (response.success && response.data) {
          dispatch({ type: "SET_CURRENT_ORDER", payload: response.data });
          showSuccessToast("Order created successfully!");
          return response.data;
        } else {
          throw new Error(response.error || "Failed to create guest order");
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to create guest order";
        dispatch({ type: "SET_ERROR", payload: errorMessage });
        showErrorToast(errorMessage);
        throw error;
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [apiCall, showLoadingToast, showSuccessToast, showErrorToast]
  );

  const createGuestPaymentSession = useCallback(
    async (orderId: string, email: string): Promise<PaymentSession> => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        dispatch({ type: "SET_ERROR", payload: null });
        dispatch({
          type: "SET_PAYMENT_FLOW_STATE",
          payload: "creating-session",
        });

        showLoadingToast("Setting up payment...");

        const response = await apiCall<PaymentSession>(
          `/api/payments/guest/orders/${orderId}/payment-session`,
          {
            method: "POST",
            body: JSON.stringify({ email }),
          }
        );

        if (response.success && response.data) {
          dispatch({ type: "SET_PAYMENT_SESSION", payload: response.data });
          showSuccessToast("Payment session created successfully!");
          return response.data;
        } else {
          throw new Error(
            response.error || "Failed to create guest payment session"
          );
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to create guest payment session";
        dispatch({ type: "SET_ERROR", payload: errorMessage });
        showErrorToast(errorMessage);
        throw error;
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [apiCall, showLoadingToast, showSuccessToast, showErrorToast]
  );

  // ============================================================================
  // PAYMENT MODAL OPERATIONS
  // ============================================================================

  const openPaymentModal = useCallback(
    (sessionId: string) => {
      dispatch({
        type: "SET_PAYMENT_FLOW_STATE",
        payload: "payment-modal-open",
      });
      showToast("Opening payment gateway...", "info");

      // The actual modal opening is handled by PaymentModal component
      // This function just sets the state to indicate modal should be open
      console.log(
        "Payment modal state set to open with session ID:",
        sessionId
      );
    },
    [showToast]
  );

  const closePaymentModal = useCallback(() => {
    dispatch({ type: "SET_PAYMENT_FLOW_STATE", payload: "idle" });
    dispatch({ type: "SET_PAYMENT_SESSION", payload: null });
    showToast("Payment modal closed", "info");
  }, [showToast]);

  // ============================================================================
  // STATE SETTERS
  // ============================================================================

  const setCurrentOrder = useCallback((order: Order | null) => {
    dispatch({ type: "SET_CURRENT_ORDER", payload: order });
  }, []);

  const setPaymentSession = useCallback((session: PaymentSession | null) => {
    dispatch({ type: "SET_PAYMENT_SESSION", payload: session });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: "SET_ERROR", payload: error });
  }, []);

  const setPricing = useCallback((pricing: PricingState | null) => {
    dispatch({ type: "SET_PRICING", payload: pricing });
  }, []);

  const setSelectedCurrency = useCallback((currency: string) => {
    dispatch({ type: "SET_SELECTED_CURRENCY", payload: currency });
  }, []);

  const setPaymentFlowState = useCallback((state: PaymentFlowState) => {
    dispatch({ type: "SET_PAYMENT_FLOW_STATE", payload: state });
  }, []);

  // ============================================================================
  // ORDER MANAGEMENT METHODS
  // ============================================================================

  const checkActiveOrders = useCallback(
    async (data: {
      programId: string;
      selectedCurrency: string;
    }): Promise<CheckActiveOrdersResponse> => {
      try {
        const response = await fetch("/api/payments/orders/check-active", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Failed to check active orders");
        }

        const result = await response.json();
        console.log("checkActiveOrders API response:", result);
        return result.data;
      } catch (error) {
        console.error("Error checking active orders:", error);
        throw error;
      }
    },
    []
  );

  const getMyOrders = useCallback(
    async (filters?: Record<string, unknown>): Promise<GetMyOrdersResponse> => {
      try {
        const params = new URLSearchParams();
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              params.append(key, String(value));
            }
          });
        }

        const response = await fetch(
          `/api/payments/my-orders?${params.toString()}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to get orders");
        }

        const result = await response.json();
        return result.data;
      } catch (error) {
        console.error("Error getting orders:", error);
        throw error;
      }
    },
    []
  );

  const getOrder = useCallback(async (orderId: string): Promise<Order> => {
    try {
      const response = await fetch(`/api/payments/orders/${orderId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to get order");
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error getting order:", error);
      throw error;
    }
  }, []);

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  const contextValue: PaymentContextType = {
    // State
    currentOrder: state.currentOrder,
    paymentSession: state.paymentSession,
    isLoading: state.isLoading,
    error: state.error,
    pricing: state.pricing,
    selectedCurrency: state.selectedCurrency,
    isPricingLoading: state.isPricingLoading,
    pricingError: state.pricingError,
    paymentFlowState: state.paymentFlowState,

    // Actions
    createOrder,
    createPaymentSession,
    verifyPayment,
    openPaymentModal,
    closePaymentModal,
    createGuestUser,
    createGuestOrder,
    createGuestPaymentSession,
    checkActiveOrders,
    getMyOrders,
    getOrder,
    updatePricing,
    getPricing,

    // Toast notifications
    showToast,
    showSuccessToast,
    showErrorToast,
    showLoadingToast,

    // State management
    setCurrentOrder,
    setPaymentSession,
    setError,
    setPricing,
    setSelectedCurrency,
    setPaymentFlowState,
  };

  return (
    <PaymentContext.Provider value={contextValue}>
      {children}
    </PaymentContext.Provider>
  );
}

// ============================================================================
// USE PAYMENT HOOK
// ============================================================================

export function usePayment() {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error("usePayment must be used within a PaymentProvider");
  }
  return context;
}
