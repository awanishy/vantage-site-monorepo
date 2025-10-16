import { Request, Response } from "express";
import { OrderModel } from "@/payments/models/order.model";
import { ProgramModel } from "@courses/courses.model";
import {
  CheckActiveOrdersRequest,
  CheckActiveOrdersResponse,
} from "@/types/payments/orders.types";

export const checkActiveOrdersHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { programId, selectedCurrency }: CheckActiveOrdersRequest = req.body;
    const authUserId = req.user.userId;

    if (!programId || !selectedCurrency) {
      res.status(400).json({
        success: false,
        message: "Program ID and selected currency are required",
      });
      return;
    }

    // Find program by programId (simple single query)
    const programDoc = await ProgramModel.findOne({
      programId: programId,
    }).lean();

    if (!programDoc) {
      res.status(404).json({
        success: false,
        message: "Program not found",
      });
      return;
    }

    // Check for active orders using the programId as string (stored in database)
    const activeOrder = await OrderModel.findOne({
      userId: authUserId,
      programId: programId, // Use the original programId as string
      selectedCurrency,
      status: "ACTIVE",
      expiresAt: { $gt: new Date() }, // Not expired
    })
      .populate("payments")
      .lean();

    const hasActiveOrder = !!activeOrder;

    const response: CheckActiveOrdersResponse = {
      hasActiveOrder,
      activeOrder: hasActiveOrder
        ? {
            orderId: activeOrder._id.toString(),
            orderNumber: activeOrder.orderNumber,
            userId: activeOrder.userId.toString(),
            programId: activeOrder.programId.toString(),
            orderAmount: activeOrder.orderAmount,
            orderCurrency: activeOrder.orderCurrency,
            programCurrency: activeOrder.programCurrency,
            selectedCurrency: activeOrder.selectedCurrency,
            fx: activeOrder.fx
              ? {
                  fromCurrency: activeOrder.fx.fromCurrency,
                  toCurrency: activeOrder.fx.toCurrency,
                  rate: activeOrder.fx.rate,
                  conversionDate: activeOrder.fx.conversionDate.toISOString(),
                }
              : undefined,
            pricingSnapshot: activeOrder.pricingSnapshot,
            status: activeOrder.status,
            orderNote: activeOrder.orderNote,
            expiresAt: activeOrder.expiresAt.toISOString(),
            metadata: activeOrder.metadata,
            payments: activeOrder.payments.map((payment: any) => ({
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
              paymentCompletionTime:
                payment.paymentCompletionTime?.toISOString(),
              createdAt: payment.createdAt.toISOString(),
              updatedAt: payment.updatedAt.toISOString(),
            })),
            createdAt: activeOrder.createdAt.toISOString(),
            updatedAt: activeOrder.updatedAt.toISOString(),
          }
        : undefined,
    };

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error: any) {
    console.error("Check active orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check active orders",
      error: error.message,
    });
  }
};
