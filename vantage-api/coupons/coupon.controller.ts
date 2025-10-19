import { Request, Response } from "express";
import { CouponService } from "./coupon.service";
import { CouponModel } from "./coupon.model";
import { CreateCouponRequest } from "@/types/coupons/coupon.types";

/**
 * Validate a coupon code
 * POST /api/coupons/validate
 */
export const validateCouponHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { code, programId, currency, orderAmount, userId } = req.body;

    console.log("[ValidateCouponHandler] Request body:", {
      code,
      programId,
      currency,
      orderAmount,
      userId,
    });

    if (!code || !programId || !currency || orderAmount === undefined) {
      res.status(400).json({
        success: false,
        message: "Code, programId, currency, and orderAmount are required",
      });
      return;
    }

    // Ensure orderAmount is a number
    const numericOrderAmount =
      typeof orderAmount === "string" ? parseFloat(orderAmount) : orderAmount;

    console.log(
      "[ValidateCouponHandler] Calling CouponService.validateCoupon with:",
      {
        code,
        programId,
        currency,
        orderAmount: numericOrderAmount,
      }
    );

    const validation = await CouponService.validateCoupon(
      code,
      programId,
      currency,
      numericOrderAmount,
      userId
    );

    console.log("[ValidateCouponHandler] Validation result:", validation);

    if (!validation.isValid) {
      res.status(200).json({
        success: true,
        data: {
          isValid: false,
          error: validation.error,
        },
      });
      return;
    }

    const calculation = CouponService.calculateDiscount(
      validation.coupon!,
      numericOrderAmount
    );

    res.status(200).json({
      success: true,
      data: {
        isValid: true,
        coupon: {
          code: validation.coupon!.code,
          name: validation.coupon!.name,
          description: validation.coupon!.description,
          type: validation.coupon!.type,
          value: validation.coupon!.value,
        },
        calculation: {
          originalAmount: calculation.originalAmount,
          discountAmount: calculation.discountAmount,
          finalAmount: calculation.finalAmount,
        },
      },
    });
  } catch (error: any) {
    console.error("Validate coupon error:", error);
    console.error("Error stack:", error.stack);
    res.status(200).json({
      success: true,
      data: {
        isValid: false,
        error: "Failed to validate coupon. Please try again.",
      },
    });
  }
};

/**
 * Get Auto-Applicable Coupons (Public) - SECURE VERSION
 * POST /api/coupons/auto-applicable
 */
export const getAutoApplicableCouponsHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { programId, currency, userType } = req.body;

    if (!programId || !currency) {
      res.status(400).json({
        success: false,
        message: "Missing required fields: programId, currency",
      });
      return;
    }

    // Validate programId exists in database to prevent injection
    const { ProgramModel } = await import("@courses/courses.model");
    const program = await ProgramModel.findOne({ programId }).lean();
    if (!program) {
      res.status(400).json({
        success: false,
        message: "Invalid program ID",
      });
      return;
    }

    // Validate currency - check if it's a valid currency code
    const validCurrencies = ["USD", "INR", "EUR", "GBP", "CAD", "AUD"];
    if (!validCurrencies.includes(currency)) {
      res.status(400).json({
        success: false,
        message: "Invalid currency code",
      });
      return;
    }

    // Calculate actual order amount from database instead of trusting client
    const programCurrency = program.pricing?.currency || "USD";
    const tuition = program.pricing?.tuition || 0;

    let actualOrderAmount = tuition;

    // Handle currency conversion if needed
    if (currency !== programCurrency) {
      try {
        const { CurrencyService } = await import("@/currency/currency.service");
        const currencyService = CurrencyService.getInstance();
        const conversion = await currencyService.convertCurrency(
          programCurrency,
          currency,
          tuition
        );
        actualOrderAmount = Math.round(conversion.convertedAmount);
      } catch (error) {
        console.error("Currency conversion error:", error);
        // Fallback to mock rate if conversion fails
        const mockRate = currency === "INR" ? 88.86 : 1;
        actualOrderAmount = Math.round(tuition * mockRate);
      }
    }

    const coupons = await CouponService.getAutoApplicableCoupons(
      programId,
      currency,
      actualOrderAmount, // Use calculated amount from database
      userType
    );

    res.status(200).json({
      success: true,
      data: {
        coupons: coupons.map((coupon) => ({
          code: coupon.code,
          name: coupon.name,
          description: coupon.description,
          type: coupon.type,
          value: coupon.value,
          discountAmount: CouponService.calculateDiscount(
            coupon,
            actualOrderAmount
          ).discountAmount,
          autoApplyPriority: coupon.autoApplyPriority,
          autoApplyConditions: coupon.autoApplyConditions,
        })),
        count: coupons.length,
      },
    });
  } catch (error: any) {
    console.error("Get auto-applicable coupons error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get auto-applicable coupons",
      error: error.message,
    });
  }
};

/**
 * Find Best Auto Coupon (Public) - SECURE VERSION
 * POST /api/coupons/auto-applicable/best
 */
export const findBestAutoCouponHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { programId, currency, userType } = req.body;

    if (!programId || !currency) {
      res.status(400).json({
        success: false,
        message: "Missing required fields: programId, currency",
      });
      return;
    }

    // Validate programId exists in database to prevent injection
    const { ProgramModel } = await import("@courses/courses.model");
    const program = await ProgramModel.findOne({ programId }).lean();
    if (!program) {
      res.status(400).json({
        success: false,
        message: "Invalid program ID",
      });
      return;
    }

    // Validate currency - check if it's a valid currency code
    const validCurrencies = ["USD", "INR", "EUR", "GBP", "CAD", "AUD"];
    if (!validCurrencies.includes(currency)) {
      res.status(400).json({
        success: false,
        message: "Invalid currency code",
      });
      return;
    }

    // Calculate actual order amount from database instead of trusting client
    const programCurrency = program.pricing?.currency || "USD";
    const tuition = program.pricing?.tuition || 0;

    console.log("[CouponController] Program pricing details:", {
      programId,
      programCurrency,
      tuition,
      requestedCurrency: currency,
      pricing: program.pricing,
    });

    let actualOrderAmount = tuition;

    // Handle currency conversion if needed
    if (currency !== programCurrency) {
      try {
        const { CurrencyService } = await import("@/currency/currency.service");
        const currencyService = CurrencyService.getInstance();
        const conversion = await currencyService.convertCurrency(
          programCurrency,
          currency,
          tuition
        );
        actualOrderAmount = Math.round(conversion.convertedAmount);
        console.log("[CouponController] Currency conversion:", {
          from: programCurrency,
          to: currency,
          rate: conversion.rate,
          originalAmount: tuition,
          convertedAmount: actualOrderAmount,
        });
      } catch (error) {
        console.error("Currency conversion error:", error);
        // Fallback to mock rate if conversion fails
        const mockRate = currency === "INR" ? 88.86 : 1;
        actualOrderAmount = Math.round(tuition * mockRate);
        console.log("[CouponController] Using fallback conversion:", {
          mockRate,
          originalAmount: tuition,
          convertedAmount: actualOrderAmount,
        });
      }
    } else {
      console.log("[CouponController] No currency conversion needed:", {
        currency,
        amount: actualOrderAmount,
      });
    }

    console.log(
      "[CouponController] Final order amount for coupon validation:",
      {
        programId,
        currency,
        actualOrderAmount,
        userType,
      }
    );

    const coupon = await CouponService.findBestAutoCoupon(
      programId,
      currency,
      actualOrderAmount, // Use calculated amount from database
      userType
    );

    console.log("[CouponController] Best auto coupon result:", {
      found: !!coupon,
      coupon: coupon
        ? {
            code: coupon.code,
            name: coupon.name,
            minOrderAmount: coupon.minOrderAmount,
            autoApplyConditions: coupon.autoApplyConditions,
          }
        : null,
    });

    if (!coupon) {
      res.status(200).json({
        success: true,
        data: { coupon: null, message: "No auto-applicable coupon found" },
      });
      return;
    }

    const calculation = CouponService.calculateDiscount(
      coupon,
      actualOrderAmount
    );

    res.status(200).json({
      success: true,
      data: {
        coupon: {
          code: coupon.code,
          name: coupon.name,
          description: coupon.description,
          type: coupon.type,
          value: coupon.value,
          autoApplyPriority: coupon.autoApplyPriority,
          autoApplyConditions: coupon.autoApplyConditions,
        },
        calculation: {
          originalAmount: calculation.originalAmount,
          discountAmount: calculation.discountAmount,
          finalAmount: calculation.finalAmount,
        },
      },
    });
  } catch (error: any) {
    console.error("Find best auto coupon error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to find best auto coupon",
      error: error.message,
    });
  }
};

/**
 * Create a new coupon (Admin only)
 * POST /api/coupons
 */
export const createCouponHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const couponData: CreateCouponRequest = req.body;
    const createdBy = req.user?.userId || "system";

    // Validate required fields
    if (
      !couponData.code ||
      !couponData.name ||
      !couponData.type ||
      !couponData.value
    ) {
      res.status(400).json({
        success: false,
        message: "Code, name, type, and value are required",
      });
      return;
    }

    // Validate coupon value
    if (!CouponService.validateCouponValue(couponData.type, couponData.value)) {
      res.status(400).json({
        success: false,
        message: "Invalid coupon value for the specified type",
      });
      return;
    }

    // Check if coupon code already exists
    const existingCoupon = await CouponService.getCouponByCode(couponData.code);
    if (existingCoupon) {
      res.status(409).json({
        success: false,
        message: "Coupon code already exists",
      });
      return;
    }

    const coupon = await CouponService.createCoupon(couponData, createdBy);

    res.status(201).json({
      success: true,
      data: coupon,
      message: "Coupon created successfully",
    });
  } catch (error: any) {
    console.error("Create coupon error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create coupon",
      error: error.message,
    });
  }
};

/**
 * Get all active coupons
 * GET /api/coupons
 */
export const getCouponsHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const coupons = await CouponService.getActiveCoupons();

    res.status(200).json({
      success: true,
      data: coupons,
    });
  } catch (error: any) {
    console.error("Get coupons error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch coupons",
      error: error.message,
    });
  }
};

/**
 * Get coupon by code
 * GET /api/coupons/:code
 */
export const getCouponHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { code } = req.params;

    if (!code) {
      res.status(400).json({
        success: false,
        message: "Coupon code is required",
      });
      return;
    }

    const coupon = await CouponService.getCouponByCode(code);

    if (!coupon) {
      res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: coupon,
    });
  } catch (error: any) {
    console.error("Get coupon error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch coupon",
      error: error.message,
    });
  }
};

/**
 * Update coupon (Admin only)
 * PUT /api/coupons/:code
 */
export const updateCouponHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { code } = req.params;
    const updateData = req.body;

    if (!code) {
      res.status(400).json({
        success: false,
        message: "Coupon code is required",
      });
      return;
    }

    // Validate coupon value if provided
    if (updateData.type && updateData.value) {
      if (
        !CouponService.validateCouponValue(updateData.type, updateData.value)
      ) {
        res.status(400).json({
          success: false,
          message: "Invalid coupon value for the specified type",
        });
        return;
      }
    }

    const coupon = await CouponService.updateCoupon(code, updateData);

    if (!coupon) {
      res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: coupon,
      message: "Coupon updated successfully",
    });
  } catch (error: any) {
    console.error("Update coupon error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update coupon",
      error: error.message,
    });
  }
};

/**
 * Deactivate coupon (Admin only)
 * DELETE /api/coupons/:code
 */
export const deactivateCouponHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { code } = req.params;

    if (!code) {
      res.status(400).json({
        success: false,
        message: "Coupon code is required",
      });
      return;
    }

    const success = await CouponService.deactivateCoupon(code);

    if (!success) {
      res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Coupon deactivated successfully",
    });
  } catch (error: any) {
    console.error("Deactivate coupon error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to deactivate coupon",
      error: error.message,
    });
  }
};

/**
 * Get coupon statistics (Admin only)
 * GET /api/coupons/:code/stats
 */
export const getCouponStatsHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { code } = req.params;

    if (!code) {
      res.status(400).json({
        success: false,
        message: "Coupon code is required",
      });
      return;
    }

    const stats = await CouponService.getCouponStats(code);

    if (!stats) {
      res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    console.error("Get coupon stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch coupon statistics",
      error: error.message,
    });
  }
};

/**
 * Generate unique coupon code (Admin only)
 * POST /api/coupons/generate-code
 */
export const generateCouponCodeHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { length = 8 } = req.body;

    if (length < 3 || length > 20) {
      res.status(400).json({
        success: false,
        message: "Length must be between 3 and 20 characters",
      });
      return;
    }

    const code = await CouponService.generateUniqueCode(length);

    res.status(200).json({
      success: true,
      data: { code },
    });
  } catch (error: any) {
    console.error("Generate coupon code error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate coupon code",
      error: error.message,
    });
  }
};
