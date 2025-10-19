// ============================================================================
// COUPON TYPES
// ============================================================================

import { Document } from "mongoose";

export interface CouponDocument extends Document {
  code: string;
  name: string;
  description?: string;
  type: "percentage" | "fixed_amount";
  value: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  validFrom: Date;
  validUntil: Date;
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
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  metadata?: {
    tags?: string[];
    category?: string;
    notes?: string;
  };
}

export interface CouponValidationResult {
  isValid: boolean;
  error?: string;
  coupon?: CouponDocument;
}

export interface CouponCalculationResult {
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
  coupon: CouponDocument;
}

export interface CreateCouponRequest {
  code: string;
  name: string;
  description?: string;
  type: "percentage" | "fixed_amount";
  value: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  validFrom: Date;
  validUntil: Date;
  usageLimit?: number;
  userUsageLimit?: number;
  applicablePrograms?: string[];
  applicableCurrencies?: string[];
  isAutoApplied?: boolean;
  autoApplyPriority?: number;
  autoApplyConditions?: {
    minOrderAmount?: number;
    userType?: string[];
    programRestrictions?: string[];
    currencyRestrictions?: string[];
    maxUsagePerDay?: number;
  };
  metadata?: {
    tags?: string[];
    category?: string;
    notes?: string;
  };
}

export interface ValidateCouponRequest {
  code: string;
  programId: string;
  currency: string;
  orderAmount: number;
  userId?: string;
}

export interface GetAutoApplicableCouponsRequest {
  programId: string;
  currency: string;
  userType?: string;
}

export interface AutoApplicableCouponResponse {
  code: string;
  name: string;
  description?: string;
  type: "percentage" | "fixed_amount";
  value: number;
  discountAmount: number;
  autoApplyPriority: number;
  autoApplyConditions?: {
    minOrderAmount?: number;
    userType?: string[];
    programRestrictions?: string[];
    currencyRestrictions?: string[];
    maxUsagePerDay?: number;
  };
}

export interface BestAutoCouponResponse {
  coupon: {
    code: string;
    name: string;
    description?: string;
    type: "percentage" | "fixed_amount";
    value: number;
    autoApplyPriority: number;
    autoApplyConditions?: {
      minOrderAmount?: number;
      userType?: string[];
      programRestrictions?: string[];
      currencyRestrictions?: string[];
      maxUsagePerDay?: number;
    };
  } | null;
  calculation?: {
    originalAmount: number;
    discountAmount: number;
    finalAmount: number;
  };
  message?: string;
}
