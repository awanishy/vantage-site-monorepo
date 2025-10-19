// ============================================================================
// COUPON TYPES - Client-side coupon interfaces
// ============================================================================

export interface Coupon {
  code: string;
  name: string;
  description?: string;
  type: "percentage" | "fixed_amount";
  value: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  validFrom: string;
  validUntil: string;
  usageLimit?: number;
  usageCount: number;
  userUsageLimit?: number;
  applicablePrograms?: string[];
  applicableCurrencies?: string[];
  isActive: boolean;
  isAutoApplied: boolean;
  autoApplyPriority: number;
  autoApplyConditions?: {
    minOrderAmount?: number;
    userType?: string[];
    programRestrictions?: string[];
    currencyRestrictions?: string[];
    maxUsagePerDay?: number;
  };
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  metadata?: {
    tags?: string[];
    category?: string;
    notes?: string;
  };
}

export interface CouponValidationRequest {
  code: string;
  programId: string;
  currency: string;
  orderAmount: number;
  userId?: string;
}

export interface CouponValidationResponse {
  success: boolean;
  isValid: boolean;
  coupon?: Coupon;
  error?: string;
  calculation?: {
    originalAmount: number;
    discountAmount: number;
    finalAmount: number;
  };
}

export interface AutoApplicableCouponsRequest {
  programId: string;
  currency: string;
  orderAmount: number;
  userType?: string;
}

export interface AutoApplicableCouponsResponse {
  success: boolean;
  data: {
    coupons: Array<{
      code: string;
      name: string;
      description?: string;
      type: "percentage" | "fixed_amount";
      value: number;
      discountAmount: number;
      autoApplyPriority: number;
      autoApplyConditions?: Coupon["autoApplyConditions"];
    }>;
    count: number;
  };
  error?: string;
}

export interface BestAutoCouponRequest {
  programId: string;
  currency: string;
  orderAmount: number;
  userType?: string;
}

export interface BestAutoCouponResponse {
  success: boolean;
  data: {
    coupon: Coupon | null;
    calculation?: {
      originalAmount: number;
      discountAmount: number;
      finalAmount: number;
    };
    message?: string;
  };
  error?: string;
}

export interface CouponCalculation {
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
  couponCode: string;
  couponType: "percentage" | "fixed_amount";
  couponValue: number;
}

export interface AppliedCoupon {
  coupon: Coupon;
  calculation: CouponCalculation;
  isAutoApplied: boolean;
  appliedAt: string;
}
