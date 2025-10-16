import { Request, Response } from "express";
import { OrderModel } from "@/payments/models/order.model";
import { ProgramModel } from "@courses/courses.model";
import { User } from "@/users/user.model";
import { OrderNumberGenerator } from "@/utils/orderNumberGenerator";
import {
  CreateOrderRequest,
  CreateOrderResponse,
} from "@/types/payments/orders.types";
import { ProgramBase } from "@/types/courses/courses.types";

export const createOrderHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { programId, selectedCurrency }: CreateOrderRequest = req.body;
    const authUserId = req.user.userId;

    if (!programId || !selectedCurrency) {
      res.status(400).json({
        success: false,
        message: "Program ID and selected currency are required",
      });
      return;
    }

    // Find program by programId (simple single query)
    const programDoc = (await ProgramModel.findOne({
      programId: programId,
    }).lean()) as ProgramBase | null;

    if (!programDoc) {
      res.status(404).json({
        success: false,
        message: "Program not found",
      });
      return;
    }

    // Calculate pricing
    const programCurrency = programDoc.pricing?.currency || "USD";
    const tuition = programDoc.pricing?.tuition || 0;
    const taxesIncluded = programDoc.pricing?.taxesIncluded || true;

    let orderAmount = tuition;
    let fx: any = undefined;

    // Handle currency conversion if needed
    if (selectedCurrency !== programCurrency) {
      // TODO: Implement actual FX conversion
      // For now, use a mock rate
      const mockRate = selectedCurrency === "INR" ? 88.86 : 1;
      orderAmount = Math.round(tuition * mockRate);

      fx = {
        fromCurrency: programCurrency,
        toCurrency: selectedCurrency,
        rate: mockRate,
        conversionDate: new Date(),
      };
    }

    // Generate order number
    const orderNumber = await OrderNumberGenerator.generate();

    // Create order
    const order = await OrderModel.create({
      orderNumber,
      userId: authUserId,
      programId: programId, // Store the original programId as string
      orderAmount,
      orderCurrency: selectedCurrency,
      programCurrency,
      selectedCurrency,
      fx,
      pricingSnapshot: {
        currency: programCurrency,
        tuition,
        taxesIncluded,
      },
      status: "ACTIVE",
      orderNote: "Program purchase",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      metadata: {
        source: "authenticated_user",
        programSlug: programDoc.slug,
        pricingVersion: "v1",
      },
      payments: [],
    });

    const response: CreateOrderResponse = {
      orderId: (order._id as any).toString(),
      orderNumber: order.orderNumber,
      amount: order.orderAmount,
      currency: order.orderCurrency,
      status: order.status,
      expiresAt: order.expiresAt.toISOString(),
    };

    res.status(201).json({
      success: true,
      data: response,
    });
  } catch (error: any) {
    console.error("Create order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};
