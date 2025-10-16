import { Request, Response } from "express";
import { CashfreeClient } from "@/payments-backup/clients/cashfree.client";
import { RefundModel } from "@/payments-backup/models/refund.model";
import { OrderModel } from "@/payments-backup/models/order.model";
import { v4 as uuidv4 } from "uuid";

export const createRefundHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { orderId } = req.params;
    const { amount, note, speed } = req.body || {};
    const authUserId = (req as any).user?.userId;

    if (!orderId || !amount) {
      res
        .status(400)
        .json({ success: false, message: "orderId and amount are required" });
      return;
    }

    const order = await OrderModel.findById(orderId).lean();
    if (!order) {
      res.status(404).json({ success: false, message: "Order not found" });
      return;
    }

    // Verify order belongs to user
    if (authUserId && String(order.userId) !== String(authUserId)) {
      res.status(403).json({ success: false, message: "Access denied" });
      return;
    }

    // Check if order is paid
    if (order.status !== "PAID") {
      res.status(400).json({
        success: false,
        message: "Only paid orders can be refunded",
      });
      return;
    }

    const cf = new CashfreeClient();
    const refundId = `refund_${uuidv4().replace(/-/g, "").slice(0, 28)}`;

    const cfRefund = await cf.createRefund(
      order.merchantOrderId ||
        (order.metadata as any)?.cfOrderId ||
        String(order._id),
      {
        refund_id: refundId,
        refund_amount: Number(amount),
        refund_note: note,
        refund_speed: speed,
      },
      { requestId: (req as any).requestId, idempotencyKey: refundId }
    );

    const refundDoc = await RefundModel.create({
      orderId: order._id as any,
      cfPaymentId: cfRefund.cf_payment_id as any,
      cfRefundId: cfRefund.cf_refund_id,
      refundId: cfRefund.refund_id,
      amount: cfRefund.refund_amount,
      currency: cfRefund.refund_currency,
      status: cfRefund.refund_status as any,
      arn: cfRefund.refund_arn || null,
      charge: cfRefund.refund_charge || null,
      statusDescription: cfRefund.status_description || null,
      mode: cfRefund.refund_mode || null,
      createdAtCF: cfRefund.created_at ? new Date(cfRefund.created_at) : null,
      processedAtCF: cfRefund.processed_at
        ? new Date(cfRefund.processed_at)
        : null,
      speed: cfRefund.refund_speed || null,
      splits: cfRefund.refund_splits || null,
      metadata: cfRefund.metadata || null,
    });

    res.status(201).json({ success: true, data: refundDoc });
  } catch (err) {
    console.error("Create refund error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to create refund" });
  }
};
