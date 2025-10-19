import { CouponModel } from "./coupon.model";
import {
  CouponDocument,
  CouponValidationResult,
  CouponCalculationResult,
  CreateCouponRequest,
} from "@/types/coupons/coupon.types";

export class CouponService {
  /**
   * Validate a coupon code for a specific order
   */
  static async validateCoupon(
    code: string,
    programId: string,
    currency: string,
    orderAmount: number,
    userId?: string
  ): Promise<CouponValidationResult> {
    try {
      const result = await CouponModel.validateCoupon(
        code,
        programId,
        currency,
        orderAmount,
        userId
      );

      return result;
    } catch (error) {
      console.error("Coupon validation error:", error);
      return {
        isValid: false,
        error: "Failed to validate coupon",
      };
    }
  }

  /**
   * Calculate discount amount for a coupon
   */
  static calculateDiscount(
    coupon: CouponDocument,
    orderAmount: number
  ): CouponCalculationResult {
    const discountAmount = CouponModel.calculateDiscount(coupon, orderAmount);
    const finalAmount = orderAmount - discountAmount;

    return {
      originalAmount: orderAmount,
      discountAmount,
      finalAmount,
      coupon,
    };
  }

  /**
   * Create a new coupon
   */
  static async createCoupon(
    couponData: CreateCouponRequest,
    createdBy: string
  ): Promise<CouponDocument> {
    const coupon = new CouponModel({
      ...couponData,
      code: couponData.code.toUpperCase(),
      createdBy,
    });

    await coupon.save();
    return coupon;
  }

  /**
   * Get all active coupons
   */
  static async getActiveCoupons(): Promise<CouponDocument[]> {
    const now = new Date();
    return await CouponModel.find({
      isActive: true,
      validFrom: { $lte: now },
      validUntil: { $gte: now },
    }).sort({ createdAt: -1 });
  }

  /**
   * Get coupon by code
   */
  static async getCouponByCode(code: string): Promise<CouponDocument | null> {
    return await CouponModel.findOne({ code: code.toUpperCase() });
  }

  /**
   * Increment coupon usage count
   */
  static async incrementUsage(code: string): Promise<boolean> {
    try {
      const result = await CouponModel.incrementUsage(code);
      return result.modifiedCount > 0;
    } catch (error) {
      console.error("Failed to increment coupon usage:", error);
      return false;
    }
  }

  /**
   * Gets all auto-applicable coupons for given conditions.
   * @param programId The program ID.
   * @param currency The currency.
   * @param orderAmount The order amount.
   * @param userType Optional user type.
   * @returns Array of applicable auto-coupons.
   */
  static async getAutoApplicableCoupons(
    programId: string,
    currency: string,
    orderAmount: number,
    userType?: string
  ): Promise<CouponDocument[]> {
    try {
      return await CouponModel.getAutoApplicableCoupons(
        programId,
        currency,
        orderAmount,
        userType
      );
    } catch (error) {
      console.error("Failed to get auto-applicable coupons:", error);
      return [];
    }
  }

  /**
   * Finds the best auto-applicable coupon based on priority and conditions.
   * @param programId The program ID.
   * @param currency The currency.
   * @param orderAmount The order amount.
   * @param userType Optional user type.
   * @returns The best auto-coupon or null if none found.
   */
  static async findBestAutoCoupon(
    programId: string,
    currency: string,
    orderAmount: number,
    userType?: string
  ): Promise<CouponDocument | null> {
    try {
      return await CouponModel.findBestAutoCoupon(
        programId,
        currency,
        orderAmount,
        userType
      );
    } catch (error) {
      console.error("Failed to find best auto-coupon:", error);
      return null;
    }
  }

  /**
   * Validates auto-apply conditions for a coupon.
   * @param coupon The coupon to validate.
   * @param programId The program ID.
   * @param currency The currency.
   * @param orderAmount The order amount.
   * @param userType Optional user type.
   * @returns True if conditions are met.
   */
  static validateAutoApplyConditions(
    coupon: CouponDocument,
    programId: string,
    currency: string,
    orderAmount: number,
    userType?: string
  ): boolean {
    try {
      return CouponModel.validateAutoApplyConditions(
        coupon,
        programId,
        currency,
        orderAmount,
        userType
      );
    } catch (error) {
      console.error("Failed to validate auto-apply conditions:", error);
      return false;
    }
  }

  /**
   * Update coupon
   */
  static async updateCoupon(
    code: string,
    updateData: Partial<CreateCouponRequest>
  ): Promise<CouponDocument | null> {
    const coupon = await CouponModel.findOneAndUpdate(
      { code: code.toUpperCase() },
      { ...updateData, code: updateData.code?.toUpperCase() },
      { new: true }
    );
    return coupon;
  }

  /**
   * Deactivate coupon
   */
  static async deactivateCoupon(code: string): Promise<boolean> {
    try {
      const result = await CouponModel.updateOne(
        { code: code.toUpperCase() },
        { isActive: false }
      );
      return result.modifiedCount > 0;
    } catch (error) {
      console.error("Failed to deactivate coupon:", error);
      return false;
    }
  }

  /**
   * Get coupon statistics
   */
  static async getCouponStats(code: string) {
    const coupon = await CouponModel.findOne({ code: code.toUpperCase() });
    if (!coupon) {
      return null;
    }

    return {
      code: coupon.code,
      name: coupon.name,
      usageCount: coupon.usageCount,
      usageLimit: coupon.usageLimit,
      usagePercentage: coupon.usageLimit
        ? Math.round((coupon.usageCount / coupon.usageLimit) * 100)
        : null,
      isActive: coupon.isActive,
      validFrom: coupon.validFrom,
      validUntil: coupon.validUntil,
      isExpired: new Date() > coupon.validUntil,
    };
  }

  /**
   * Validate coupon value based on type
   */
  static validateCouponValue(type: string, value: number): boolean {
    if (type === "percentage") {
      return value >= 0 && value <= 100;
    } else if (type === "fixed_amount") {
      return value >= 0;
    }
    return false;
  }

  /**
   * Generate a unique coupon code
   */
  static async generateUniqueCode(length: number = 8): Promise<string> {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code: string;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 100;

    do {
      code = "";
      for (let i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      const existingCoupon = await CouponModel.findOne({ code });
      isUnique = !existingCoupon;
      attempts++;
    } while (!isUnique && attempts < maxAttempts);

    if (!isUnique) {
      throw new Error("Failed to generate unique coupon code");
    }

    return code;
  }
}
