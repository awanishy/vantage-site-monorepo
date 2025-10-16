import { Request, Response } from "express";
import { OrderModel } from "@/payments-backup/models/order.model";
import { PaymentModel } from "@/payments-backup/models/payment.model";
import { CashfreeClient } from "@/payments-backup/clients/cashfree.client";
import { User } from "@/users/user.model";
import { v4 as uuidv4 } from "uuid";
import { getEnv } from "@/config/env";

export const createPaymentSessionHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { orderId } = req.params;
    const authUserId = (req as any).user?.userId;

    if (!authUserId) {
      res
        .status(401)
        .json({ success: false, message: "Authentication required" });
      return;
    }

    if (!orderId) {
      res.status(400).json({ success: false, message: "Order ID required" });
      return;
    }

    // Get our order
    const order = await OrderModel.findById(orderId).lean();
    if (!order) {
      res.status(404).json({ success: false, message: "Order not found" });
      return;
    }

    // Verify order belongs to user
    if (String(order.userId) !== String(authUserId)) {
      res
        .status(403)
        .json({ success: false, message: "Order does not belong to user" });
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

    // Get user details
    const user = await User.findById(authUserId).lean();
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    // Create Cashfree payment session
    const cf = new CashfreeClient();
    const requestId = uuidv4();

    try {
      const cfOrder = await cf.createPaymentSession(
        {
          order_amount: order.orderAmount,
          order_currency: order.orderCurrency,
          customer_details: {
            customer_id: String(user._id),
            customer_email: user.email,
            customer_phone: user.phone || "9999999999",
            customer_name: user.name,
          },
          order_id: order.merchantOrderId, // Use our order ID
          order_meta: {
            return_url: `${
              getEnv().FRONTEND_URL
            }/payments/status?order_id={order_id}`,
            notify_url: `${getEnv().BACKEND_URL}/api/payments/webhooks`,
          },
          order_note: "Program purchase",
        },
        { requestId, idempotencyKey: order.merchantOrderId }
      );

      console.log("Cashfree payment session created:", cfOrder);

      // Create payment record only
      const paymentDoc = await PaymentModel.create({
        orderId: order._id,
        cfPaymentId: cfOrder.cf_order_id, // Store Cashfree order ID as payment ID
        paymentGroup: null,
        methodPayload: null,
        amount: order.orderAmount,
        currency: order.orderCurrency,
        status: "PENDING", // Payment session created, awaiting user action
        paymentMessage: "Payment session created - awaiting user action",
        bankReference: null,
        authorization: null,
        paymentTime: new Date(), // Session creation time
        paymentCompletionTime: null,
        errorDetails: null,
        metadata: cfOrder, // Store entire Cashfree response
      });

      res.status(200).json({
        success: true,
        data: {
          orderId: order._id,
          orderNumber: order.orderNumber,
          merchantOrderId: order.merchantOrderId,
          cfOrderId: cfOrder.cf_order_id,
          paymentSessionId: cfOrder.payment_session_id,
          paymentId: paymentDoc._id, // Include the payment ID
          amount: order.orderAmount,
          currency: order.orderCurrency,
          status: order.status,
        },
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
    console.error("Create payment session error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create payment session",
    });
  }
};
