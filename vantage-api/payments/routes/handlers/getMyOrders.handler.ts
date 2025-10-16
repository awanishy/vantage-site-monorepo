import { Request, Response } from "express";
import { OrderModel } from "@/payments/models/order.model";
import { GetMyOrdersResponse } from "@/types/payments/orders.types";

export const getMyOrdersHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const authUserId = req.user.userId;

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;

    // Build query
    const query: any = { userId: authUserId };
    if (status) {
      query.status = status;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get orders with populated payments
    const orders = await OrderModel.find(query)
      .populate("payments")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count
    const total = await OrderModel.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    const response: GetMyOrdersResponse = {
      orders: orders.map((order) => ({
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
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error: any) {
    console.error("Get my orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get orders",
      error: error.message,
    });
  }
};
