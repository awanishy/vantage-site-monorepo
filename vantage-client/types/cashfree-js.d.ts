declare module "@cashfreepayments/cashfree-js" {
  // Minimal SDK surface used by the app
  interface CashfreeCheckoutOptions {
    paymentSessionId: string;
    redirectTarget?: "_modal" | "_self" | "_blank";
    returnUrl?: string;
  }

  interface CashfreeCheckoutResult {
    error?: string;
    redirect?: boolean;
    paymentDetails?: Record<string, unknown>;
  }

  interface CashfreeSDK {
    checkout(options: CashfreeCheckoutOptions): Promise<CashfreeCheckoutResult>;
  }

  export function load(options: {
    mode: "sandbox" | "production";
  }): Promise<CashfreeSDK>;
}
