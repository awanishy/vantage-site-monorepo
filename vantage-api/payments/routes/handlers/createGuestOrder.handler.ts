import { Request, Response } from "express";
import { OrderModel } from "@/payments/models/order.model";
import { ProgramModel } from "@courses/courses.model";
import { OrderNumberGenerator } from "@/utils/orderNumberGenerator";
import {
  CreateOrderRequest,
  CreateOrderResponse,
} from "@/types/payments/orders.types";
import { ProgramBase } from "@/types/courses/courses.types";
import { getOrCreateGuestUser } from "@/users/controllers/user.controller";
import { CreateGuestUserRequest } from "@/types/users/user.types";

export interface CreateGuestOrderRequest extends CreateGuestUserRequest {
  programId: string;
  selectedCurrency: string;
}

export interface CreateGuestOrderResponse {
  orderId: string;
  orderNumber: string;
  amount: number;
  currency: string;
  status: string;
  expiresAt: string;
  userId: string;
  isGuest: boolean;
  message: string;
}

export const createGuestOrderHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      programId,
      selectedCurrency,
      email,
      name,
      phone,
      guestUserId,
    }: CreateGuestOrderRequest & { guestUserId?: string } = req.body;

    // Validate required fields
    if (!programId || !selectedCurrency) {
      res.status(400).json({
        success: false,
        message: "Program ID and selected currency are required",
      });
      return;
    }

    // If guestUserId is provided, we need email and name to create a new guest user
    // If guestUserId is not provided, we need email and name to create a new guest user
    if (!guestUserId && (!email || !name)) {
      res.status(400).json({
        success: false,
        message: "Either guestUserId or email and name are required",
      });
      return;
    }

    let user;
    let isNewUser = false;

    if (guestUserId) {
      // Use existing guest user
      const { User } = await import("@users/user.model");
      user = await User.findById(guestUserId).lean();

      if (!user) {
        res.status(404).json({
          success: false,
          message: "Guest user not found",
        });
        return;
      }
    } else {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email!)) {
        res.status(400).json({
          success: false,
          message: "Invalid email format",
        });
        return;
      }

      // Get or create guest user using user controller
      const result = await getOrCreateGuestUser(email!, name!, phone);
      user = result.user;
      isNewUser = result.isNewUser;
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
      userId: user._id,
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
      orderNote: "Guest program purchase",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      metadata: {
        source: "guest_user",
        programSlug: programDoc.slug,
        pricingVersion: "v1",
      },
      payments: [],
    });

    const response: CreateGuestOrderResponse = {
      orderId: (order._id as any).toString(),
      orderNumber: order.orderNumber,
      amount: order.orderAmount,
      currency: order.orderCurrency,
      status: order.status,
      expiresAt: order.expiresAt.toISOString(),
      userId: (user._id as any).toString(),
      isGuest: true,
      message:
        "Guest order created successfully. User credentials have been sent to your email.",
    };

    res.status(201).json({
      success: true,
      data: response,
    });
  } catch (error: any) {
    console.error("Create guest order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create guest order",
      error: error.message,
    });
  }
};
