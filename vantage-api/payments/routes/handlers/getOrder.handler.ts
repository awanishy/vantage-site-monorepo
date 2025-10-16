import { Request, Response } from "express";
import { OrderModel } from "@/payments/models/order.model";
import { GetOrderResponse } from "@/types/payments/orders.types";

export const getOrderHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const authUserId = req.user.userId;

    if (!id) {
      res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
      return;
    }

    // Get order with populated payments
    const order = await OrderModel.findById(id).populate("payments").lean();

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
      return;
    }

    // Verify ownership
    if (String(order.userId) !== String(authUserId)) {
      res.status(403).json({
        success: false,
        message: "Order does not belong to user",
      });
      return;
    }

    const response: GetOrderResponse = {
      orderId: order._id.toString(),
      orderNumber: order.orderNumber,
      userId: order.userId.toString(),
      programId: order.programId.toString(),
      orderAmount: order.orderAmount,
      orderCurrency: order.orderCurrency,
      programCurrency: order.programCurrency,
      selectedCurrency: order.selectedCurrency,
      fx: order.fx
        ? {
            fromCurrency: order.fx.fromCurrency,
            toCurrency: order.fx.toCurrency,
            rate: order.fx.rate,
            conversionDate: order.fx.conversionDate.toISOString(),
          }
        : undefined,
      pricingSnapshot: order.pricingSnapshot,
      status: order.status,
      orderNote: order.orderNote,
      expiresAt: order.expiresAt.toISOString(),
      metadata: order.metadata,
      payments: order.payments.map((payment: any) => ({
        paymentId: payment._id.toString(),
        cfOrderId: payment.cfOrderId,
        cfPaymentId: payment.cfPaymentId,
        paymentSessionId: payment.paymentSessionId,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        paymentMessage: payment.paymentMessage,
        bankReference: payment.bankReference,
        paymentTime: payment.paymentTime?.toISOString(),
        paymentCompletionTime: payment.paymentCompletionTime?.toISOString(),
        createdAt: payment.createdAt.toISOString(),
        updatedAt: payment.updatedAt.toISOString(),
      })),
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    };

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error: any) {
    console.error("Get order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get order",
      error: error.message,
    });
  }
};
