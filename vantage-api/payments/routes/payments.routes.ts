import { Router } from "express";
import { authorize, adminAuth } from "@/middlewares/authorize";

// Order Management Handlers
import { createOrderHandler } from "@/payments/routes/handlers/createOrder.handler";
import { getOrderHandler } from "@/payments/routes/handlers/getOrder.handler";
import { getMyOrdersHandler } from "@/payments/routes/handlers/getMyOrders.handler";
import { checkActiveOrdersHandler } from "@/payments/routes/handlers/checkActiveOrders.handler";

import { createGuestOrderHandler } from "@/payments/routes/handlers/createGuestOrder.handler";
import { createGuestPaymentSessionHandler } from "@/payments/routes/handlers/createGuestPaymentSession.handler";
import { verifyGuestPaymentHandler } from "@/payments/routes/handlers/verifyGuestPayment.handler";

// Payment Session Handlers
import { createPaymentSessionHandler } from "@/payments/routes/handlers/createPaymentSession.handler";

// Payment Management Handlers
import { webhookHandler } from "@/payments/routes/handlers/webhook.handler";
import { verifyPaymentHandler } from "@/payments/routes/handlers/verifyPayment.handler";

// Refund Management Handlers
import { createRefundHandler } from "@/payments/routes/handlers/createRefund.handler";
import { getRefundHandler } from "@/payments/routes/handlers/getRefund.handler";

// Admin Handlers
import { adminStatsHandler } from "@/payments/routes/handlers/adminStats.handler";

// Pricing Handler
import { getPricingHandler } from "./handlers/getPricing.handler";

const router = Router();

// ============================================================================
// PUBLIC ROUTES (No authentication required)
// ============================================================================

/**
 * @route POST /api/payments/pricing
 * @desc Calculate pricing for a program
 * @access Public
 */
router.post("/pricing", getPricingHandler);

/**
 * @route POST /api/payments/webhooks
 * @desc Cashfree payment webhooks
 * @access Public (Cashfree calls this)
 */
// router.post("/webhooks", webhookHandler);

/**
 * @route POST /api/payments/webhooks/test
 * @desc Test webhook endpoint for debugging
 * @access Public
 */
router.post("/webhooks/test", (req, res) => {
  console.log("[Test Webhook] Raw body type:", typeof req.body);
  console.log("[Test Webhook] Is Buffer:", Buffer.isBuffer(req.body));
  console.log("[Test Webhook] Raw body:", req.body);

  if (Buffer.isBuffer(req.body)) {
    try {
      const parsed = JSON.parse(req.body.toString());
      console.log("[Test Webhook] Parsed body:", parsed);
      res.json({ success: true, parsed });
    } catch (error) {
      console.log("[Test Webhook] Parse error:", error);
      res.json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  } else {
    console.log("[Test Webhook] Body as-is:", req.body);
    res.json({ success: true, body: req.body });
  }
});

/**
 * @route POST /api/payments/guest/order
 * @desc Create order for guest user
 * @access Public
 */
router.post("/guest/order", createGuestOrderHandler);

/**
 * @route POST /api/payments/guest/orders/:orderId/payment-session
 * @desc Create payment session for guest order
 * @access Public
 */
router.post(
  "/guest/orders/:orderId/payment-session",
  createGuestPaymentSessionHandler
);

/**
 * @route POST /api/payments/guest/orders/:orderId/verify
 * @desc Verify payment status for guest order (by email)
 * @access Public
 */
router.post("/guest/orders/:orderId/verify", verifyGuestPaymentHandler);

// ============================================================================
// AUTHENTICATED ROUTES (User must be logged in)
// ============================================================================

/**
 * @route POST /api/payments/orders
 * @desc Create a new order
 * @access Private
 */
router.post("/orders", authorize(), createOrderHandler);

/**
 * @route GET /api/payments/orders/:id
 * @desc Get order details
 * @access Private
 */
router.get("/orders/:id", authorize(), getOrderHandler);

/**
 * @route GET /api/payments/my-orders
 * @desc Get user's orders
 * @access Private
 */
router.get("/my-orders", authorize(), getMyOrdersHandler);

/**
 * @route POST /api/payments/orders/check-active
 * @desc Check for active orders
 * @access Private
 */
router.post("/orders/check-active", authorize(), checkActiveOrdersHandler);

/**
 * @route POST /api/payments/orders/:orderId/payment-session
 * @desc Create payment session for an order
 * @access Private
 */
router.post(
  "/orders/:orderId/payment-session",
  authorize(),
  createPaymentSessionHandler
);

/**
 * @route POST /api/payments/orders/:orderId/verify
 * @desc Verify payment status
 * @access Private
 */
router.post("/orders/:orderId/verify", authorize(), verifyPaymentHandler);

/**
 * @route POST /api/payments/orders/:orderId/refunds
 * @desc Create refund for an order
 * @access Private
 */
router.post("/orders/:orderId/refunds", authorize(), createRefundHandler);

/**
 * @route GET /api/payments/refunds/:refundId
 * @desc Get refund details
 * @access Private
 */
router.get("/refunds/:refundId", authorize(), getRefundHandler);

// ============================================================================
// ADMIN ROUTES (Admin authentication required)
// ============================================================================

/**
 * @route GET /api/payments/admin/stats
 * @desc Get admin statistics
 * @access Admin
 */
router.get("/admin/stats", authorize(), adminAuth, adminStatsHandler);

// ============================================================================
// ROUTE DOCUMENTATION
// ============================================================================

/**
 * API Routes Overview:
 *
 * PUBLIC ROUTES:
 * - POST /pricing - Calculate pricing for a program
 * - POST /webhooks - Cashfree payment webhooks
 * - POST /guest/user - Create guest user account
 * - POST /guest/order - Create order for guest user
 * - POST /guest/orders/:orderId/payment-session - Create payment session for guest order
 * - POST /guest/orders/:orderId/verify - Verify guest order payment
 *
 * AUTHENTICATED ROUTES:
 * - POST /orders - Create order
 * - GET /orders/:id - Get order details
 * - GET /my-orders - Get user's orders
 * - POST /orders/check-active - Check for active orders
 * - POST /orders/:orderId/payment-session - Create payment session
 * - POST /orders/:orderId/verify - Verify payment
 * - POST /orders/:orderId/refunds - Create refund
 * - GET /refunds/:refundId - Get refund details
 *
 * ADMIN ROUTES:
 * - GET /admin/stats - Get admin statistics
 */

export default router;
