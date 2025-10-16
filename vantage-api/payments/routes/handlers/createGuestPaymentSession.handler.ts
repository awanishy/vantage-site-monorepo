import { Request, Response } from "express";
import { OrderModel } from "@/payments/models/order.model";
import { CashfreeOrderModel } from "@/payments/models/cashfreeOrder.model";
import { PaymentModel } from "@/payments/models/payment.model";
import { User } from "@/users/user.model";
import { cashfreeClient } from "@/payments/clients/cashfree.client";
import { v4 as uuidv4 } from "uuid";
import { getEnv } from "@/config/env";
import { CreatePaymentSessionResponse } from "@/types/payments/payments.types";

export interface CreateGuestPaymentSessionRequest {
  orderId: string;
  email: string;
}

export const createGuestPaymentSessionHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { orderId } = req.params;
    const { email }: CreateGuestPaymentSessionRequest = req.body;

    if (!orderId || !email) {
      res.status(400).json({
        success: false,
        message: "Order ID and email are required",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
      return;
    }

    // Get our order
    const order = await OrderModel.findById(orderId).lean();
    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
      return;
    }

    // Get user to verify email matches
    const user = await User.findById(order.userId).lean();
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Verify email matches the order's user
    if (user.email.toLowerCase() !== email.toLowerCase()) {
      res.status(403).json({
        success: false,
        message: "Email does not match the order",
      });
      return;
    }

    // Check if order is still active
    if (order.status !== "ACTIVE") {
      res.status(400).json({
        success: false,
        message: `Order is ${order.status.toLowerCase()}, cannot create payment session`,
      });
      return;
    }

    // Check if order has expired
    if (order.expiresAt && new Date() > order.expiresAt) {
      res.status(400).json({
        success: false,
        message: "Order has expired",
      });
      return;
    }

    // Validate order expiry time for Cashfree (must be > 15 min and < 30 days)
    const now = new Date();
    const minExpiry = new Date(now.getTime() + 16 * 60 * 1000); // 16 minutes from now
    const maxExpiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

    if (order.expiresAt < minExpiry) {
      res.status(400).json({
        success: false,
        message: "Order expiry time is too soon for payment processing",
      });
      return;
    }

    if (order.expiresAt > maxExpiry) {
      res.status(400).json({
        success: false,
        message: "Order expiry time exceeds maximum allowed duration",
      });
      return;
    }

    // Create Cashfree order
    const cf = cashfreeClient;
    const requestId = uuidv4();
    const merchantOrderId = `order_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    try {
      const cfOrder = await cf.createOrder(
        {
          order_amount: order.orderAmount,
          order_currency: order.orderCurrency,
          customer_details: {
            customer_id: String(user._id),
            customer_email: user.email,
            customer_phone: user.phone || "9999999999",
            customer_name: user.name,
          },
          order_id: merchantOrderId,
          order_meta: {
            return_url: `${
              getEnv().FRONTEND_URL
            }/payments/status?order_id={order_id}`,
            notify_url: `${getEnv().BACKEND_URL}/api/payments/webhooks`,
          },
          order_note: "Guest program purchase",
          order_expiry_time: order.expiresAt.toISOString(), // Use order's actual expiry time
        },
        { requestId, idempotencyKey: merchantOrderId }
      );

      // Create Cashfree order record
      const cashfreeOrder = await CashfreeOrderModel.create({
        orderId: order._id,
        cfOrderId: cfOrder.cf_order_id,
        merchantOrderId: cfOrder.order_id,
        entity: cfOrder.entity,
        orderCurrency: cfOrder.order_currency,
        orderAmount: cfOrder.order_amount,
        orderStatus: cfOrder.order_status,
        paymentSessionId: cfOrder.payment_session_id,
        orderExpiryTime: cfOrder.order_expiry_time
          ? new Date(cfOrder.order_expiry_time)
          : undefined,
        orderNote: cfOrder.order_note,
        createdAtCF: cfOrder.created_at
          ? new Date(cfOrder.created_at)
          : undefined,
        orderSplits: cfOrder.order_splits,
        orderTags: cfOrder.order_tags,
        orderMeta: cfOrder.order_meta,
        customerDetails: cfOrder.customer_details,
        products: cfOrder.products,
        cartDetails: cfOrder.cart_details,
        terminalData: cfOrder.terminal_data,
        isActive: true,
        lastUpdatedAt: new Date(),
      });

      // Create payment record
      const payment = await PaymentModel.create({
        orderId: order._id,
        cashfreeOrderId: cashfreeOrder._id,
        cfOrderId: cfOrder.cf_order_id,
        paymentSessionId: cfOrder.payment_session_id,
        amount: order.orderAmount,
        currency: order.orderCurrency,
        status: "PENDING",
        paymentMessage: "Guest payment session created - awaiting user action",
        metadata: {
          sessionCreatedAt: new Date(),
          source: "payment_session_creation",
        },
      });

      // Update our order to add payment reference
      await OrderModel.updateOne(
        { _id: order._id },
        {
          $addToSet: { payments: payment._id },
        }
      );

      const response: CreatePaymentSessionResponse = {
        orderId: order._id.toString(),
        orderNumber: order.orderNumber,
        cfOrderId: cfOrder.cf_order_id,
        paymentSessionId: cfOrder.payment_session_id,
        paymentId: (payment._id as any).toString(),
        amount: order.orderAmount,
        currency: order.orderCurrency,
        status: order.status,
        expiresAt: order.expiresAt.toISOString(),
      };

      res.status(200).json({
        success: true,
        data: response,
      });
    } catch (cfError: any) {
      console.error("Cashfree payment session creation error:", cfError);

      res.status(500).json({
        success: false,
        message: "Failed to create payment session. Please try again.",
        error: cfError.message,
      });
    }
  } catch (error: any) {
    console.error("Create guest payment session error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create payment session",
      error: error.message,
    });
  }
};
