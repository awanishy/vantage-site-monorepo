import { Router } from "express";
import { createOrderHandler } from "@/payments-backup/routes/handlers/createOrder.handler";
import { guestCheckoutHandler } from "@/payments-backup/routes/handlers/guestCheckout.handler";
import { paymentsWebhookHandler } from "@/payments-backup/routes/handlers/webhook.handler";
import { getOrderHandler } from "@/payments-backup/routes/handlers/getOrder.handler";
import { getPaymentHandler } from "@/payments-backup/routes/handlers/getPayment.handler";
import { createRefundHandler } from "@/payments-backup/routes/handlers/createRefund.handler";
import { adminStatsHandler } from "@/payments-backup/routes/handlers/adminStats.handler";
import { getPricingHandler } from "@/payments-backup/routes/handlers/getPricing.handler";
import { verifyPaymentHandler } from "@/payments-backup/routes/handlers/verifyPayment.handler";
import { checkActiveOrdersHandler } from "@/payments-backup/routes/handlers/checkActiveOrders.handler";
import { createPaymentSessionHandler } from "@/payments-backup/routes/handlers/createPaymentSession.handler";
import { createGuestPaymentSessionHandler } from "@/payments-backup/routes/handlers/createGuestPaymentSession.handler";
import { getMyOrdersHandler } from "@/payments-backup/routes/handlers/getMyOrders.handler";
import { authorize, adminAuth } from "@/middlewares/authorize";

const router = Router();

// ============================================================================
// PUBLIC ROUTES (No authentication required)
// ============================================================================

// Pricing calculation
router.post("/pricing", getPricingHandler);

// Guest checkout (creates user and order)
router.post("/guest-checkout", guestCheckoutHandler);

// Webhooks (Cashfree payment notifications)
router.post("/webhooks", paymentsWebhookHandler);

// Guest payment session creation (no authentication required)
router.post(
  "/orders/:orderId/guest-payment-session",
  createGuestPaymentSessionHandler
);

// Payment verification (for testing and manual verification)
router.post("/orders/:orderId/verify", verifyPaymentHandler);

// ============================================================================
// AUTHENTICATED ROUTES (User must be logged in)
// ============================================================================

// Order Management
router.post("/orders", authorize(), createOrderHandler);
router.get("/orders/:id", authorize(), getOrderHandler);
router.get("/my-orders", authorize(), getMyOrdersHandler);
router.post("/orders/check-active", authorize(), checkActiveOrdersHandler);

// Payment Session Management
router.post(
  "/orders/:orderId/payment-session",
  authorize(),
  createPaymentSessionHandler
);

// Payment Management
router.get("/payments/:id", authorize(), getPaymentHandler);

// Refund Management
router.post("/orders/:orderId/refunds", authorize(), createRefundHandler);

// ============================================================================
// ADMIN ROUTES (Admin authentication required)
// ============================================================================

// Admin statistics and management
router.get("/admin/stats", authorize(), adminAuth, adminStatsHandler);

// ============================================================================
// ROUTE DOCUMENTATION
// ============================================================================

/**
 * API Routes Overview:
 *
 * PUBLIC ROUTES:
 * - POST /pricing - Calculate pricing for a program
 * - POST /guest-checkout - Create guest user and order
 * - POST /webhooks - Cashfree payment webhooks
 * - POST /orders/:orderId/guest-payment-session - Create payment session for guest users
 * - POST /orders/:orderId/verify - Verify payment status
 *
 * AUTHENTICATED ROUTES:
 * - POST /orders - Create authenticated user order
 * - GET /orders/:id - Get order details
 * - GET /my-orders - Get user's orders
 * - POST /orders/check-active - Check for active orders
 * - POST /orders/:orderId/payment-session - Create payment session
 * - GET /payments/:id - Get payment details
 * - POST /orders/:orderId/refunds - Create refund
 *
 * ADMIN ROUTES:
 * - GET /admin/stats - Get admin statistics
 */

export default router;
