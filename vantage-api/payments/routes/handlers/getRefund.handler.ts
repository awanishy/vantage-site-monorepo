import { Request, Response } from "express";
import { RefundModel } from "@/payments/models/refund.model";
import { GetRefundResponse } from "@/types/payments/payments.types";

export const getRefundHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { refundId } = req.params;
    const authUserId = req.user.userId;

    if (!refundId) {
      res.status(400).json({
        success: false,
        message: "Refund ID is required",
      });
      return;
    }

    // Get refund with populated order and payment
    const refund = await RefundModel.findById(refundId)
      .populate("orderId")
      .populate("paymentId")
      .lean();

    if (!refund) {
      res.status(404).json({
        success: false,
        message: "Refund not found",
      });
      return;
    }

    // Verify ownership through order
    const order = refund.orderId as any;
    if (String(order.userId) !== String(authUserId)) {
      res.status(403).json({
        success: false,
        message: "Refund does not belong to user",
      });
      return;
    }

    const response: GetRefundResponse = {
      refundId: refund.refundId,
      cfRefundId: refund.cfRefundId,
      orderId: refund.orderId.toString(),
      paymentId: refund.paymentId.toString(),
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
      refundSplits: refund.splits,
      refundCreatedAt:
        refund.createdAtCF?.toISOString() || refund.createdAt.toISOString(),
      refundProcessedAt: refund.processedAtCF?.toISOString(),
      refundStatusDescription: refund.statusDescription,
      createdAt: refund.createdAt.toISOString(),
      updatedAt: refund.updatedAt.toISOString(),
    };

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error: any) {
    console.error("Get refund error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get refund",
      error: error.message,
    });
  }
};
