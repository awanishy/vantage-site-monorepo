import { Request, Response } from "express";
import { OrderModel } from "@/payments-backup/models/order.model";
import { PaymentModel } from "@/payments-backup/models/payment.model";
import { RefundModel } from "@/payments-backup/models/refund.model";

export const adminStatsHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const [ordersCount, paymentsCount, refundsCount] = await Promise.all([
      OrderModel.countDocuments({}),
      PaymentModel.countDocuments({}),
      RefundModel.countDocuments({}),
    ]);

    // Get total order amounts (only for PAID orders)
    const [totalOrderAmount] = await OrderModel.aggregate([
      { $match: { status: "PAID" } },
      { $group: { _id: null, total: { $sum: "$orderAmount" } } },
    ]);

    // Get total refund amounts
    const [totalRefundAmount] = await RefundModel.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // Get order status breakdown
    const orderStatusBreakdown = await OrderModel.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Get payment status breakdown
    const paymentStatusBreakdown = await PaymentModel.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        ordersCount,
        paymentsCount,
        refundsCount,
        totalOrderAmount: totalOrderAmount?.total || 0,
        totalRefundAmount: totalRefundAmount?.total || 0,
        orderStatusBreakdown,
        paymentStatusBreakdown,
      },
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch stats" });
  }
};
