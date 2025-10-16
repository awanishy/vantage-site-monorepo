// ============================================================================
// CASHFREE PAYMENT UTILITY - Direct payment integration
// ============================================================================

import { load } from "@cashfreepayments/cashfree-js";
import { PaymentSession } from "@/types";

interface CashfreeResult {
  error?: string;
  redirect?: boolean;
  paymentDetails?: Record<string, unknown>;
}

interface PaymentOptions {
  paymentSession: PaymentSession;
  onSuccess?: (paymentData: Record<string, unknown>) => void;
  onFailure?: (error: Record<string, unknown>) => void;
  onClose?: () => void;
}

export async function openCashfreePayment({
  paymentSession,
  onSuccess,
  onFailure,
  onClose,
}: PaymentOptions): Promise<void> {
  try {
    console.log("Loading Cashfree SDK...");

    // Load Cashfree SDK
    const cashfree = await load({
      mode: process.env.NODE_ENV === "production" ? "production" : "sandbox",
    });

    if (!cashfree) {
      throw new Error("Failed to load Cashfree SDK");
    }

    console.log("Cashfree SDK loaded successfully");

    // Validate payment session
    if (!paymentSession.paymentSessionId) {
      throw new Error("Invalid payment session - missing payment session ID");
    }

    if (!paymentSession.orderId) {
      throw new Error("Invalid payment session - missing order ID");
    }

    if (!paymentSession.paymentSessionId.startsWith("session_")) {
      throw new Error("Invalid payment session ID format");
    }

    console.log("Payment session validation passed:", {
      paymentSessionId: paymentSession.paymentSessionId,
      orderId: paymentSession.orderId,
      amount: paymentSession.amount,
      currency: paymentSession.currency,
    });

    // Configure payment options with strict typing
    const paymentOptions: {
      paymentSessionId: string;
      redirectTarget?: "_modal" | "_self" | "_blank";
      returnUrl?: string;
    } = {
      paymentSessionId: paymentSession.paymentSessionId,
      redirectTarget: "_modal", // Open as popup modal
      returnUrl: `${window.location.origin}/payment-success?orderId=${paymentSession.orderId}`,
    };

    console.log("Calling cashfree.checkout with options:", paymentOptions);

    // Open Cashfree payment modal
    cashfree
      .checkout(paymentOptions)
      .then((result: CashfreeResult) => {
        console.log("Cashfree checkout result:", result);

        if (result.error) {
          // User closed the popup or payment error
          console.log(
            "User has closed the popup or there is some payment error"
          );
          console.log("Error details:", result.error);
          onFailure?.({
            error: result.error,
            orderId: paymentSession.orderId,
          });
          onClose?.();
        }

        if (result.redirect) {
          // Payment redirection couldn't be opened in same window
          console.log("Payment will be redirected");
        }

        if (result.paymentDetails) {
          // Payment completed
          console.log("Payment has been completed");
          console.log("Payment details:", result.paymentDetails);
          onSuccess?.({
            ...result.paymentDetails,
            orderId: paymentSession.orderId,
          });
          onClose?.();
        }
      })
      .catch((error: Error) => {
        console.error("Cashfree checkout error:", error);
        onFailure?.({
          error: error.message,
          orderId: paymentSession.orderId,
        });
        onClose?.();
      });
  } catch (error) {
    console.error("Payment initialization error:", error);
    onFailure?.({
      error: error instanceof Error ? error.message : "Unknown error",
      orderId: paymentSession.orderId,
    });
  }
}
