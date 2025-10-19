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
import { CouponService } from "@/coupons/coupon.service";

export interface CreateOrderRequestExtended extends CreateOrderRequest {
  email?: string;
  name?: string;
  phone?: string;
  guestUserId?: string;
  couponCode?: string;
}

export const createOrderHandler = async (
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
      couponCode,
    }: CreateOrderRequestExtended = req.body;

    if (!programId || !selectedCurrency) {
      res.status(400).json({
        success: false,
        message: "Program ID and selected currency are required",
      });
      return;
    }

    // For guest-only flow, we need user details
    if (!guestUserId && (!email || !name)) {
      res.status(400).json({
        success: false,
        message:
          "Either guestUserId or email and name are required for guest checkout",
      });
      return;
    }

    // Handle guest user creation/retrieval
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

    // Handle coupon validation and discount calculation
    let couponDiscount = 0;
    let appliedCoupon = null;
    let finalOrderAmount = orderAmount;
    let isAutoApplied = false;

    // First, check for auto-applicable coupons if no manual coupon provided
    if (!couponCode) {
      try {
        // Additional security: Validate program exists and get actual pricing
        const programDoc = await ProgramModel.findOne({ programId }).lean();
        if (!programDoc) {
          res.status(400).json({
            success: false,
            message: "Invalid program ID",
          });
          return;
        }

        // Use actual program pricing instead of trusting client data
        const actualOrderAmount = programDoc.pricing?.tuition || 0;

        const autoCoupon = await CouponService.findBestAutoCoupon(
          programId,
          selectedCurrency,
          actualOrderAmount, // Use actual amount from database
          "guest" // For guest users, we can use "guest" as userType
        );

        if (autoCoupon) {
          const couponCalculation = CouponService.calculateDiscount(
            autoCoupon,
            actualOrderAmount // Use actual amount from database
          );

          couponDiscount = couponCalculation.discountAmount;
          finalOrderAmount = couponCalculation.finalAmount;
          appliedCoupon = {
            code: autoCoupon.code,
            name: autoCoupon.name,
            type: autoCoupon.type,
            value: autoCoupon.value,
            discountAmount: couponDiscount,
          };
          isAutoApplied = true;

          // Increment coupon usage count
          await CouponService.incrementUsage(autoCoupon.code);
        }
      } catch (error: any) {
        console.error("Auto-coupon validation error:", error);
        // Don't fail the order if auto-coupon fails, just continue without coupon
      }
    }

    // If manual coupon is provided, it overrides auto-coupon
    if (couponCode) {
      try {
        const couponValidation = await CouponService.validateCoupon(
          couponCode,
          programId,
          selectedCurrency,
          orderAmount,
          user?._id?.toString()
        );

        if (couponValidation.isValid && couponValidation.coupon) {
          const couponCalculation = CouponService.calculateDiscount(
            couponValidation.coupon,
            orderAmount
          );

          couponDiscount = couponCalculation.discountAmount;
          finalOrderAmount = couponCalculation.finalAmount;
          appliedCoupon = {
            code: couponValidation.coupon.code,
            name: couponValidation.coupon.name,
            type: couponValidation.coupon.type,
            value: couponValidation.coupon.value,
            discountAmount: couponDiscount,
          };
          isAutoApplied = false; // Manual coupon overrides auto-coupon

          // Increment coupon usage count
          await CouponService.incrementUsage(couponCode);
        } else {
          res.status(400).json({
            success: false,
            message: couponValidation.error || "Invalid coupon code",
          });
          return;
        }
      } catch (error: any) {
        console.error("Coupon validation error:", error);
        res.status(500).json({
          success: false,
          message: "Failed to validate coupon",
          error: error.message,
        });
        return;
      }
    }

    // Generate order number
    const orderNumber = await OrderNumberGenerator.generate();

    // Create order
    const order = await OrderModel.create({
      orderNumber,
      userId: user._id,
      programId: programId, // Store the original programId as string
      orderAmount: finalOrderAmount, // Use final amount after coupon discount
      orderCurrency: selectedCurrency,
      programCurrency,
      selectedCurrency,
      fx,
      pricingSnapshot: {
        currency: programCurrency,
        tuition,
        taxesIncluded,
        originalAmount: orderAmount, // Store original amount before discount
        couponDiscount: couponDiscount,
        appliedCoupon: appliedCoupon,
        isAutoApplied: isAutoApplied,
      },
      status: "ACTIVE",
      orderNote: appliedCoupon
        ? `Guest program purchase with ${
            isAutoApplied ? "auto-applied" : "manual"
          } coupon ${appliedCoupon.code}`
        : "Guest program purchase",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      metadata: {
        source: "guest_user",
        programSlug: programDoc.slug,
        pricingVersion: "v1",
        couponApplied: !!appliedCoupon,
        couponCode: appliedCoupon?.code,
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
      message: isNewUser
        ? "Guest order created successfully. User credentials have been sent to your email."
        : "Guest order created successfully.",
      coupon: appliedCoupon
        ? {
            code: appliedCoupon.code,
            name: appliedCoupon.name,
            discountAmount: appliedCoupon.discountAmount,
            originalAmount: orderAmount,
            finalAmount: finalOrderAmount,
            isAutoApplied: isAutoApplied,
          }
        : null,
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
