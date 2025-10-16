import { Request, Response } from "express";
import { OrderModel } from "@/payments/models/order.model";
import { CashfreeOrderModel } from "@/payments/models/cashfreeOrder.model";
import { PaymentModel } from "@/payments/models/payment.model";
import { RefundModel } from "@/payments/models/refund.model";
import { cashfreeClient } from "@/payments/clients/cashfree.client";
import { v4 as uuidv4 } from "uuid";
import {
  CreateRefundRequest,
  CreateRefundResponse,
} from "@/types/payments/payments.types";

export const createRefundHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { orderId } = req.params;
    const { refundAmount, refundId, refundNote }: CreateRefundRequest =
      req.body;
    const authUserId = req.user.userId;

    if (!orderId || !refundAmount || !refundId) {
      res.status(400).json({
        success: false,
        message: "Order ID, refund amount, and refund ID are required",
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

    // Verify order belongs to user
    if (String(order.userId) !== String(authUserId)) {
      res.status(403).json({
        success: false,
        message: "Order does not belong to user",
      });
      return;
    }

    // Check if order is PAID
    if (order.status !== "PAID") {
      res.status(400).json({
        success: false,
        message: `Order is ${order.status.toLowerCase()}, only PAID orders can be refunded`,
      });
      return;
    }

    // Get Cashfree order
    const cashfreeOrder = await CashfreeOrderModel.findOne({
      orderId: order._id,
    }).lean();

    if (!cashfreeOrder) {
      res.status(404).json({
        success: false,
        message: "Cashfree order not found",
      });
      return;
    }

    // Get successful payment
    const successfulPayment = await PaymentModel.findOne({
      orderId: order._id,
      status: "SUCCESS",
    }).lean();

    if (!successfulPayment) {
      res.status(400).json({
        success: false,
        message: "No successful payment found for this order",
      });
      return;
    }

    // Check if refund amount is valid
    if (refundAmount > order.orderAmount) {
      res.status(400).json({
        success: false,
        message: "Refund amount cannot exceed order amount",
      });
      return;
    }

    // Check if refund already exists
    const existingRefund = await RefundModel.findOne({
      orderId: order._id,
      refundId: refundId,
    });

    if (existingRefund) {
      res.status(400).json({
        success: false,
        message: "Refund with this ID already exists",
      });
      return;
    }

    try {
      // Create refund with Cashfree
      const cf = cashfreeClient;
      const requestId = uuidv4();

      const cfRefund = await cf.createRefund(
        cashfreeOrder.cfOrderId,
        {
          refund_amount: refundAmount,
          refund_id: refundId,
          refund_note: refundNote,
        },
        { requestId, idempotencyKey: refundId }
      );

      // Create refund record
      const refund = await RefundModel.create({
        orderId: order._id,
        paymentId: successfulPayment._id,
        cashfreeOrderId: cashfreeOrder._id,
        cfRefundId: cfRefund.cf_refund_id,
        refundId: cfRefund.refund_id,
        cfPaymentId: cfRefund.cf_payment_id,
        cfOrderId: cfRefund.cf_order_id,
        amount: refundAmount,
        currency: order.orderCurrency,
        status: "PENDING",
        reason: refundNote,
        arn: cfRefund.refund_arn,
        charge: cfRefund.refund_charge,
        statusDescription: cfRefund.refund_status_description,
        mode: cfRefund.refund_mode,
        speed: cfRefund.refund_speed,
        createdAtCF: new Date(cfRefund.refund_created_at),
        processedAtCF: cfRefund.refund_processed_at
          ? new Date(cfRefund.refund_processed_at)
          : undefined,
        splits: cfRefund.refund_splits,
        metadata: {
          cfRefundData: cfRefund,
        },
        webhookReceivedAt: new Date(),
      });

      const response: CreateRefundResponse = {
        refundId: refund.refundId,
        cfRefundId: refund.cfRefundId,
        cfPaymentId: refund.cfPaymentId,
        cfOrderId: refund.cfOrderId,
        refundAmount: refund.amount,
        refundCurrency: refund.currency,
        refundStatus: refund.status,
        refundNote: refund.reason,
        refundArn: refund.arn,
        refundCharge: refund.charge,
        refundMode: refund.mode,
        refundSpeed: refund.speed,
        refundCreatedAt:
          refund.createdAtCF?.toISOString() || refund.createdAt.toISOString(),
        refundProcessedAt: refund.processedAtCF?.toISOString(),
      };

      res.status(201).json({
        success: true,
        data: response,
      });
    } catch (cfError: any) {
      console.error("Cashfree refund creation error:", cfError);

      res.status(500).json({
        success: false,
        message: "Failed to create refund with Cashfree",
        error: cfError.message,
      });
    }
  } catch (error: any) {
    console.error("Create refund error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create refund",
      error: error.message,
    });
  }
};
