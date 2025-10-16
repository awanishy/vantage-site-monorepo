import { Request, Response } from "express";
import { OrderModel } from "@/payments/models/order.model";
import { PaymentModel } from "@/payments/models/payment.model";
import { RefundModel } from "@/payments/models/refund.model";
import { AdminStatsResponse } from "@/types/payments/payments.types";

export const adminStatsHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Get total orders
    const totalOrders = await OrderModel.countDocuments();

    // Get total order amount (only PAID orders)
    const totalOrderAmountResult = await OrderModel.aggregate([
      { $match: { status: "PAID" } },
      { $group: { _id: null, total: { $sum: "$orderAmount" } } },
    ]);
    const totalOrderAmount = totalOrderAmountResult[0]?.total || 0;

    // Get total payments
    const totalPayments = await PaymentModel.countDocuments();

    // Get total refunds
    const totalRefunds = await RefundModel.countDocuments();

    // Get order status breakdown
    const orderStatusBreakdown = await OrderModel.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const orderStatusMap = orderStatusBreakdown.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {} as Record<string, number>);

    // Get payment status breakdown
    const paymentStatusBreakdown = await PaymentModel.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const paymentStatusMap = paymentStatusBreakdown.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {} as Record<string, number>);

    // Get refund status breakdown
    const refundStatusBreakdown = await RefundModel.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const refundStatusMap = refundStatusBreakdown.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {} as Record<string, number>);

    // Get recent orders
    const recentOrders = await OrderModel.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("orderNumber orderAmount orderCurrency status createdAt")
      .lean();

    // Get recent payments
    const recentPayments = await PaymentModel.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("amount currency status paymentTime createdAt")
      .populate("orderId", "orderNumber")
      .lean();

    const response: AdminStatsResponse = {
      totalOrders,
      totalOrderAmount,
      totalPayments,
      totalRefunds,
      orderStatusBreakdown: {
        ACTIVE: orderStatusMap.ACTIVE || 0,
        PAID: orderStatusMap.PAID || 0,
        EXPIRED: orderStatusMap.EXPIRED || 0,
        CANCELLED: orderStatusMap.CANCELLED || 0,
      },
      paymentStatusBreakdown: {
        PENDING: paymentStatusMap.PENDING || 0,
        SUCCESS: paymentStatusMap.SUCCESS || 0,
        FAILED: paymentStatusMap.FAILED || 0,
        USER_DROPPED: paymentStatusMap.USER_DROPPED || 0,
      },
      refundStatusBreakdown: {
        PENDING: refundStatusMap.PENDING || 0,
        SUCCESS: refundStatusMap.SUCCESS || 0,
        FAILED: refundStatusMap.FAILED || 0,
      },
      recentOrders: recentOrders.map((order) => ({
        orderId: order._id.toString(),
        orderNumber: order.orderNumber,
        orderAmount: order.orderAmount,
        orderCurrency: order.orderCurrency,
        status: order.status,
        createdAt: order.createdAt.toISOString(),
      })),
      recentPayments: recentPayments.map((payment) => {
        const order = payment.orderId as any;
        return {
          paymentId: payment._id.toString(),
          orderId: order._id.toString(),
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status,
          paymentTime: payment.paymentTime?.toISOString(),
          createdAt: payment.createdAt.toISOString(),
        };
      }),
    };

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error: any) {
    console.error("Admin stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get admin statistics",
      error: error.message,
    });
  }
};
