import mongoose, { Schema } from "mongoose";
import { CouponDocument } from "@/types/coupons/coupon.types";

const CouponSchema = new Schema<CouponDocument>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
      match: /^[A-Z0-9_-]+$/, // Only uppercase letters, numbers, underscores, and hyphens
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    type: {
      type: String,
      required: true,
      enum: ["percentage", "fixed_amount"],
    },
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    minOrderAmount: {
      type: Number,
      min: 0,
    },
    maxDiscountAmount: {
      type: Number,
      min: 0,
    },
    validFrom: {
      type: Date,
      required: true,
    },
    validUntil: {
      type: Date,
      required: true,
    },
    usageLimit: {
      type: Number,
      min: 1,
    },
    usageCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    userUsageLimit: {
      type: Number,
      min: 1,
    },
    applicablePrograms: [
      {
        type: String,
        trim: true,
      },
    ],
    applicableCurrencies: [
      {
        type: String,
        trim: true,
        uppercase: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    // Auto-apply fields
    isAutoApplied: {
      type: Boolean,
      default: false,
    },
    autoApplyPriority: {
      type: Number,
      default: 999, // Higher number = lower priority
      min: 1,
    },
    autoApplyConditions: {
      minOrderAmount: {
        type: Number,
        min: 0,
      },
      userType: [String],
      programRestrictions: [String],
      currencyRestrictions: [String],
      maxUsagePerDay: {
        type: Number,
        min: 1,
      },
    },
    createdBy: {
      type: String,
      required: true,
    },
    metadata: {
      tags: [String],
      category: String,
      notes: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
CouponSchema.index({ code: 1 });
CouponSchema.index({ isActive: 1, validFrom: 1, validUntil: 1 });
CouponSchema.index({ applicablePrograms: 1 });
CouponSchema.index({ createdBy: 1 });
// Auto-apply indexes
CouponSchema.index({ isAutoApplied: 1, isActive: 1, autoApplyPriority: 1 });
CouponSchema.index({ "autoApplyConditions.programRestrictions": 1 });
CouponSchema.index({ "autoApplyConditions.currencyRestrictions": 1 });

// Validation middleware
CouponSchema.pre("save", function (next) {
  // Validate percentage coupons
  if (this.type === "percentage" && this.value > 100) {
    return next(new Error("Percentage discount cannot exceed 100%"));
  }

  // Validate date range
  if (this.validFrom >= this.validUntil) {
    return next(new Error("Valid from date must be before valid until date"));
  }

  // Validate usage limits
  if (this.usageLimit && this.usageCount > this.usageLimit) {
    return next(new Error("Usage count cannot exceed usage limit"));
  }

  next();
});

// Define static methods interface
interface CouponModelStatic extends mongoose.Model<CouponDocument> {
  validateCoupon(
    code: string,
    programId: string,
    currency: string,
    orderAmount: number,
    userId?: string
  ): Promise<{ isValid: boolean; error?: string; coupon?: CouponDocument }>;
  calculateDiscount(coupon: CouponDocument, orderAmount: number): number;
  incrementUsage(code: string): Promise<any>;
  // Auto-apply methods
  getAutoApplicableCoupons(
    programId: string,
    currency: string,
    orderAmount: number,
    userType?: string
  ): Promise<CouponDocument[]>;
  findBestAutoCoupon(
    programId: string,
    currency: string,
    orderAmount: number,
    userType?: string
  ): Promise<CouponDocument | null>;
  validateAutoApplyConditions(
    coupon: CouponDocument,
    programId: string,
    currency: string,
    orderAmount: number,
    userType?: string
  ): boolean;
}

// Static methods for coupon validation and calculation
CouponSchema.statics.validateCoupon = async function (
  code: string,
  programId: string,
  currency: string,
  orderAmount: number,
  userId?: string
) {
  const searchCode = code.toUpperCase().trim();
  console.log("[CouponValidation] Searching for code:", searchCode);

  const coupon = await this.findOne({
    code: searchCode,
    isActive: true,
  });

  console.log(
    "[CouponValidation] Found coupon:",
    coupon ? coupon.code : "NOT FOUND"
  );

  if (!coupon) {
    return {
      isValid: false,
      error: "Invalid coupon code",
    };
  }

  // Check if coupon is within validity period
  const now = new Date();
  if (now < coupon.validFrom || now > coupon.validUntil) {
    return {
      isValid: false,
      error: "Coupon has expired or is not yet valid",
    };
  }

  // Check usage limit
  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
    return {
      isValid: false,
      error: "Coupon usage limit exceeded",
    };
  }

  // Check minimum order amount
  if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) {
    return {
      isValid: false,
      error: `Minimum order amount of ${
        coupon.minOrderAmount / 100
      } ${currency} required`,
    };
  }

  // Check applicable programs
  if (coupon.applicablePrograms && coupon.applicablePrograms.length > 0) {
    if (!coupon.applicablePrograms.includes(programId)) {
      return {
        isValid: false,
        error: "Coupon is not applicable to this program",
      };
    }
  }

  // Check applicable currencies
  if (coupon.applicableCurrencies && coupon.applicableCurrencies.length > 0) {
    if (!coupon.applicableCurrencies.includes(currency.toUpperCase())) {
      return {
        isValid: false,
        error: "Coupon is not applicable to this currency",
      };
    }
  }

  return {
    isValid: true,
    coupon,
  };
};

CouponSchema.statics.calculateDiscount = function (
  coupon: CouponDocument,
  orderAmount: number
) {
  let discountAmount = 0;

  if (coupon.type === "percentage") {
    discountAmount = Math.round((orderAmount * coupon.value) / 100);

    // Apply maximum discount limit if set
    if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
      discountAmount = coupon.maxDiscountAmount;
    }
  } else if (coupon.type === "fixed_amount") {
    discountAmount = coupon.value;
  }

  // Ensure discount doesn't exceed order amount
  discountAmount = Math.min(discountAmount, orderAmount);

  return discountAmount;
};

CouponSchema.statics.incrementUsage = async function (code: string) {
  return await this.updateOne(
    { code: code.toUpperCase() },
    { $inc: { usageCount: 1 } }
  );
};

// Auto-apply static methods
CouponSchema.statics.getAutoApplicableCoupons = async function (
  programId: string,
  currency: string,
  orderAmount: number,
  userType?: string
): Promise<CouponDocument[]> {
  const now = new Date();

  // Fetch all auto-applied active coupons (no date filter in MongoDB)
  // We filter dates in JavaScript to avoid MongoDB date comparison issues
  const allCoupons = await this.find({
    isAutoApplied: true,
    isActive: true,
  });

  // Filter by date in JavaScript
  const dateCoupons = allCoupons.filter((c: CouponDocument) => {
    const validFrom = new Date(c.validFrom);
    const validUntil = new Date(c.validUntil);
    return validFrom <= now && validUntil >= now;
  });

  // Filter in JavaScript for all conditions
  const filteredCoupons = dateCoupons.filter((coupon: CouponDocument) => {
    // Check usage limit
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return false;
    }

    // Check applicable programs
    if (coupon.applicablePrograms && coupon.applicablePrograms.length > 0) {
      if (!coupon.applicablePrograms.includes(programId)) {
        return false;
      }
    }

    // Check applicable currencies
    if (coupon.applicableCurrencies && coupon.applicableCurrencies.length > 0) {
      if (!coupon.applicableCurrencies.includes(currency)) {
        return false;
      }
    }

    // Check auto-apply conditions
    return CouponModel.validateAutoApplyConditions(
      coupon,
      programId,
      currency,
      orderAmount,
      userType
    );
  });

  return filteredCoupons;
};

CouponSchema.statics.findBestAutoCoupon = async function (
  programId: string,
  currency: string,
  orderAmount: number,
  userType?: string
): Promise<CouponDocument | null> {
  const applicableCoupons = await CouponModel.getAutoApplicableCoupons(
    programId,
    currency,
    orderAmount,
    userType
  );

  if (applicableCoupons.length === 0) {
    return null;
  }

  // Sort by priority (lower number = higher priority), then by discount amount
  applicableCoupons.sort((a: CouponDocument, b: CouponDocument) => {
    if (a.autoApplyPriority !== b.autoApplyPriority) {
      return a.autoApplyPriority - b.autoApplyPriority;
    }

    // If same priority, prefer higher discount
    const discountA = CouponModel.calculateDiscount(a, orderAmount);
    const discountB = CouponModel.calculateDiscount(b, orderAmount);
    return discountB - discountA;
  });

  return applicableCoupons[0];
};

CouponSchema.statics.validateAutoApplyConditions = function (
  coupon: CouponDocument,
  programId: string,
  currency: string,
  orderAmount: number,
  userType?: string
): boolean {
  const conditions = coupon.autoApplyConditions;
  if (!conditions) return true;

  // Check minimum order amount
  if (conditions.minOrderAmount && orderAmount < conditions.minOrderAmount) {
    return false;
  }

  // Check user type restrictions
  if (conditions.userType && conditions.userType.length > 0) {
    if (!userType || !conditions.userType.includes(userType)) {
      return false;
    }
  }

  // Check program restrictions
  if (
    conditions.programRestrictions &&
    conditions.programRestrictions.length > 0
  ) {
    if (!conditions.programRestrictions.includes(programId)) {
      return false;
    }
  }

  // Check currency restrictions
  if (
    conditions.currencyRestrictions &&
    conditions.currencyRestrictions.length > 0
  ) {
    if (!conditions.currencyRestrictions.includes(currency)) {
      return false;
    }
  }

  return true;
};

export const CouponModel: CouponModelStatic = mongoose.model<CouponDocument>(
  "Coupon",
  CouponSchema
) as CouponModelStatic;
