import https from "https";
import fetch, { Headers } from "node-fetch";
import {
  CreateOrderPayload,
  CreateOrderResponse,
  CreateRefundPayload,
  RefundEntity,
} from "@/types/payments-backup/payments.types";

export class CashfreeClient {
  private baseUrl: string;
  private appId: string;
  private secret: string;
  private apiVersion: string;
  private agent = new https.Agent({ keepAlive: true });

  constructor(opts?: { baseUrl?: string; apiVersion?: string }) {
    this.baseUrl =
      opts?.baseUrl ||
      process.env.CF_BASE_URL ||
      "https://sandbox.cashfree.com/pg";
    this.apiVersion =
      opts?.apiVersion || process.env.CF_API_VERSION || "2025-01-01";
    this.appId = process.env.CF_CLIENT_ID as string;
    this.secret = process.env.CF_CLIENT_SECRET as string;
    if (!this.appId || !this.secret) {
      throw new Error(
        "Cashfree credentials missing (CF_CLIENT_ID/CF_CLIENT_SECRET)"
      );
    }
  }

  private buildHeaders(extra?: Record<string, string>) {
    const h = new Headers();
    h.set("x-client-id", this.appId);
    h.set("x-client-secret", this.secret);
    h.set("x-api-version", this.apiVersion);
    h.set("content-type", "application/json");
    if (extra) {
      Object.entries(extra).forEach(([k, v]) => h.set(k, v));
    }
    return h;
  }

  /**
   * Create a payment session for our order
   * This creates a Cashfree order that represents a payment session
   */
  async createPaymentSession(
    payload: CreateOrderPayload,
    opts?: { requestId?: string; idempotencyKey?: string }
  ): Promise<CreateOrderResponse> {
    const headers: Record<string, string> = {};
    if (opts?.requestId) headers["x-request-id"] = opts.requestId;
    if (opts?.idempotencyKey)
      headers["x-idempotency-key"] = opts.idempotencyKey;

    const res = await fetch(`${this.baseUrl}/orders`, {
      method: "POST",
      headers: this.buildHeaders(headers) as any,
      body: JSON.stringify(payload),
      agent: this.agent,
    });

    if (res.status === 429) {
      // Simple backoff based on headers when available
      const retry = Number(res.headers.get("x-ratelimit-retry") || "1");
      await new Promise((r) => setTimeout(r, Math.max(retry, 1) * 1000));
      return this.createPaymentSession(payload, opts);
    }

    if (!res.ok) {
      const text = await res.text();
      throw new Error(
        `Cashfree createPaymentSession failed: ${res.status} ${text}`
      );
    }
    const data = (await res.json()) as CreateOrderResponse;
    return data;
  }

  /**
   * Fetch payment session details
   * This fetches the Cashfree order that represents our payment session
   */
  async fetchPaymentSession(orderId: string): Promise<any> {
    const res = await fetch(`${this.baseUrl}/orders/${orderId}`, {
      method: "GET",
      headers: this.buildHeaders() as any,
      agent: this.agent,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(
        `Cashfree fetchPaymentSession failed: ${res.status} ${text}`
      );
    }

    return await res.json();
  }

  /**
   * Create a refund for a payment session
   */
  async createRefund(
    orderId: string,
    payload: CreateRefundPayload,
    opts?: { requestId?: string; idempotencyKey?: string }
  ): Promise<RefundEntity> {
    const headers: Record<string, string> = {};
    if (opts?.requestId) headers["x-request-id"] = opts.requestId;
    if (opts?.idempotencyKey)
      headers["x-idempotency-key"] = opts.idempotencyKey;

    const res = await fetch(`${this.baseUrl}/orders/${orderId}/refunds`, {
      method: "POST",
      headers: this.buildHeaders(headers) as any,
      body: JSON.stringify(payload),
      agent: this.agent,
    });

    if (res.status === 429) {
      const retry = Number(res.headers.get("x-ratelimit-retry") || "1");
      await new Promise((r) => setTimeout(r, Math.max(retry, 1) * 1000));
      return this.createRefund(orderId, payload, opts);
    }

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Cashfree createRefund failed: ${res.status} ${text}`);
    }
    const data = (await res.json()) as RefundEntity;
    return data;
  }

  /**
   * Fetch payment attempts for a payment session
   */
  async fetchPayments(orderId: string): Promise<any[]> {
    const res = await fetch(`${this.baseUrl}/orders/${orderId}/payments`, {
      method: "GET",
      headers: this.buildHeaders() as any,
      agent: this.agent,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Cashfree fetchPayments failed: ${res.status} ${text}`);
    }

    const data = await res.json();
    // Ensure we return an array - Cashfree might return an object or array
    return Array.isArray(data) ? data : [];
  }

  // Legacy methods for backward compatibility (deprecated)
  /** @deprecated Use createPaymentSession instead */
  async createOrder(
    payload: CreateOrderPayload,
    opts?: { requestId?: string; idempotencyKey?: string }
  ): Promise<CreateOrderResponse> {
    console.warn("createOrder is deprecated, use createPaymentSession instead");
    return this.createPaymentSession(payload, opts);
  }

  /** @deprecated Use fetchPaymentSession instead */
  async fetchOrder(orderId: string): Promise<any> {
    console.warn("fetchOrder is deprecated, use fetchPaymentSession instead");
    return this.fetchPaymentSession(orderId);
  }
}
