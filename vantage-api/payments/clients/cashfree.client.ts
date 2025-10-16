import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import {
  CreateOrderPayload,
  CreateOrderResponse,
  GetOrderResponse,
  PaymentResponse,
  CreateRefundPayload,
  CreateRefundResponse,
  RequestOptions,
  CashfreeClientConfig,
  CashfreeError,
} from "@/types/payments/cashfree.types";
import { getEnv } from "@/config/env";

export class CashfreeClient {
  private client: AxiosInstance;
  private config: CashfreeClientConfig;

  constructor() {
    const env = getEnv();
    this.config = {
      clientId: env.CF_CLIENT_ID,
      clientSecret: env.CF_CLIENT_SECRET,
      environment: env.NODE_ENV === "production" ? "production" : "sandbox",
      apiVersion: "2025-01-01",
    };

    const baseURL =
      this.config.environment === "production"
        ? "https://api.cashfree.com/pg"
        : "https://sandbox.cashfree.com/pg";

    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
        "x-api-version": this.config.apiVersion,
        "x-client-id": this.config.clientId,
        "x-client-secret": this.config.clientSecret,
      },
    });

    // Request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        console.log(`[Cashfree] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error("[Cashfree] Request error:", error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => {
        console.log(`[Cashfree] ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error(
          "[Cashfree] Response error:",
          error.response?.data || error.message
        );
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: any): CashfreeError {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      return {
        type: "API_ERROR",
        code: data?.code || `HTTP_${status}`,
        message: data?.message || `HTTP ${status} Error`,
        details: data,
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        type: "NETWORK_ERROR",
        code: "NO_RESPONSE",
        message: "No response received from Cashfree API",
        details: error.request,
      };
    } else {
      // Something else happened
      return {
        type: "CLIENT_ERROR",
        code: "UNKNOWN",
        message: error.message || "Unknown error occurred",
        details: error,
      };
    }
  }

  private buildHeaders(options?: RequestOptions): Record<string, string> {
    const headers: Record<string, string> = {};

    if (options?.requestId) {
      headers["x-request-id"] = options.requestId;
    }

    if (options?.idempotencyKey) {
      headers["x-idempotency-key"] = options.idempotencyKey;
    }

    return headers;
  }

  // ============================================================================
  // ORDER MANAGEMENT
  // ============================================================================

  /**
   * Create a new order with Cashfree
   */
  async createOrder(
    payload: CreateOrderPayload,
    options?: RequestOptions
  ): Promise<CreateOrderResponse> {
    try {
      const response = await this.client.post<CreateOrderResponse>(
        "/orders",
        payload,
        {
          headers: this.buildHeaders(options),
        }
      );

      return response.data;
    } catch (error) {
      console.error("Create order error:", error);
      throw error;
    }
  }

  /**
   * Get order details from Cashfree
   */
  async getOrder(
    orderId: string,
    options?: RequestOptions
  ): Promise<GetOrderResponse> {
    try {
      const response = await this.client.get<GetOrderResponse>(
        `/orders/${orderId}`,
        {
          headers: this.buildHeaders(options),
        }
      );

      return response.data;
    } catch (error) {
      console.error("Get order error:", error);
      throw error;
    }
  }

  // ============================================================================
  // PAYMENT MANAGEMENT
  // ============================================================================

  /**
   * Get payments for an order
   */
  async getPayments(
    orderId: string,
    options?: RequestOptions
  ): Promise<PaymentResponse[]> {
    try {
      const response = await this.client.get<PaymentResponse[]>(
        `/orders/${orderId}/payments`,
        {
          headers: this.buildHeaders(options),
        }
      );

      return response.data;
    } catch (error) {
      console.error("Get payments error:", error);
      throw error;
    }
  }

  /**
   * Get payment by ID
   */
  async getPayment(
    orderId: string,
    paymentId: string,
    options?: RequestOptions
  ): Promise<PaymentResponse> {
    try {
      const response = await this.client.get<PaymentResponse>(
        `/orders/${orderId}/payments/${paymentId}`,
        {
          headers: this.buildHeaders(options),
        }
      );

      return response.data;
    } catch (error) {
      console.error("Get payment error:", error);
      throw error;
    }
  }

  async terminateOrder(
    orderId: string,
    options?: RequestOptions
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.client.patch(
        `/orders/${orderId}`,
        {
          order_status: "TERMINATED",
        },
        {
          headers: this.buildHeaders(options),
        }
      );
      return {
        success: true,
        message: "Order terminated successfully",
      };
    } catch (error) {
      console.error("Terminate order error:", error);
      throw error;
    }
  }

  // ============================================================================
  // REFUND MANAGEMENT
  // ============================================================================

  /**
   * Create a refund for an order
   */
  async createRefund(
    orderId: string,
    payload: CreateRefundPayload,
    options?: RequestOptions
  ): Promise<CreateRefundResponse> {
    try {
      const response = await this.client.post<CreateRefundResponse>(
        `/orders/${orderId}/refunds`,
        payload,
        {
          headers: this.buildHeaders(options),
        }
      );

      return response.data;
    } catch (error) {
      console.error("Create refund error:", error);
      throw error;
    }
  }

  /**
   * Get refund details
   */
  async getRefund(
    orderId: string,
    refundId: string,
    options?: RequestOptions
  ): Promise<CreateRefundResponse> {
    try {
      const response = await this.client.get<CreateRefundResponse>(
        `/orders/${orderId}/refunds/${refundId}`,
        {
          headers: this.buildHeaders(options),
        }
      );

      return response.data;
    } catch (error) {
      console.error("Get refund error:", error);
      throw error;
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Test the connection to Cashfree API
   */
  async testConnection(): Promise<boolean> {
    try {
      // Try to get a non-existent order to test authentication
      await this.getOrder("test-connection");
      return true;
    } catch (error: any) {
      // If we get a 404, it means authentication is working
      if (error.code === "HTTP_404" || error.code === "NOT_FOUND") {
        return true;
      }
      return false;
    }
  }

  /**
   * Get client configuration
   */
  getConfig(): CashfreeClientConfig {
    return { ...this.config };
  }

  /**
   * Get base URL
   */
  getBaseURL(): string {
    return this.client.defaults.baseURL || "";
  }
}

// Export singleton instance
export const cashfreeClient = new CashfreeClient();
