"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { BestAutoCouponResponse, AutoApplicableCouponsResponse } from "@/types";
import { useToast } from "@/providers/ToastProvider";

interface CouponCodeProps {
  programId: string;
  selectedCurrency: string;
  orderAmount: number;
  onCouponApplied: (
    coupon: BestAutoCouponResponse["data"]["coupon"],
    calculation: BestAutoCouponResponse["data"]["calculation"]
  ) => void;
  onCouponRemoved: () => void;
  disabled?: boolean;
  hasPricing?: boolean;
  isPricingLoading?: boolean;
}

export const CouponCode: React.FC<CouponCodeProps> = ({
  programId,
  selectedCurrency,
  orderAmount,
  onCouponApplied,
  onCouponRemoved,
  disabled = false,
  hasPricing = true,
  isPricingLoading = false,
}) => {
  const { showToast } = useToast();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // State
  const [appliedCoupon, setAppliedCoupon] = useState<
    BestAutoCouponResponse["data"] | null
  >(null);
  const [availableCoupons, setAvailableCoupons] = useState<
    AutoApplicableCouponsResponse["data"]["coupons"]
  >([]);
  const [isLoadingCoupons, setIsLoadingCoupons] = useState(false);
  const [couponInputValue, setCouponInputValue] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [userManuallyRemoved, setUserManuallyRemoved] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Format currency
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Fetch all available coupons and auto-apply the best one
  const fetchAvailableCoupons = useCallback(async () => {
    if (!hasPricing || isPricingLoading || orderAmount === 0) return;

    // Don't auto-apply if user manually removed a coupon
    if (userManuallyRemoved) return;

    setIsLoadingCoupons(true);
    try {
      // Fetch the best auto-applicable coupon
      const bestResponse = await fetch("/api/coupons/auto-applicable/best", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          programId,
          currency: selectedCurrency,
          userType: "guest",
        }),
      });

      // Fetch all available coupons for dropdown
      const allResponse = await fetch("/api/coupons/auto-applicable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          programId,
          currency: selectedCurrency,
          userType: "guest",
        }),
      });

      if (allResponse.ok) {
        const allData: AutoApplicableCouponsResponse = await allResponse.json();
        if (
          allData.success &&
          allData.data &&
          Array.isArray(allData.data.coupons)
        ) {
          setAvailableCoupons(allData.data.coupons);
        } else {
          setAvailableCoupons([]);
        }
      }

      // Auto-apply the best coupon
      if (bestResponse.ok) {
        const bestData: BestAutoCouponResponse = await bestResponse.json();
        if (bestData.success && bestData.data.coupon) {
          setAppliedCoupon(bestData.data);
          setCouponInputValue(bestData.data.coupon.code);
          showToast(`Auto-applied: ${bestData.data.coupon.name}`, "success");
          // Notify parent
          onCouponApplied(bestData.data.coupon, bestData.data.calculation);
        }
      }
    } catch (error) {
      console.error("Failed to fetch available coupons:", error);
      setAvailableCoupons([]);
    } finally {
      setIsLoadingCoupons(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    hasPricing,
    isPricingLoading,
    orderAmount,
    programId,
    selectedCurrency,
    userManuallyRemoved,
    showToast,
  ]);

  // Fetch available coupons when pricing is ready
  useEffect(() => {
    if (
      hasPricing &&
      !isPricingLoading &&
      orderAmount > 0 &&
      !userManuallyRemoved
    ) {
      fetchAvailableCoupons();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasPricing, isPricingLoading, orderAmount, programId, selectedCurrency]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  // Handle coupon application from input
  const handleApplyCoupon = async () => {
    if (!couponInputValue.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    const codeToValidate = couponInputValue.trim().toUpperCase();
    console.log("[CouponCode] Validating coupon code:", codeToValidate);

    setIsApplyingCoupon(true);
    setCouponError("");

    try {
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: codeToValidate,
          programId,
          currency: selectedCurrency,
          orderAmount,
        }),
      });

      // Check if response is OK
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        throw new Error(`Server error: ${response.status}`);
      }

      // Try to parse JSON
      let data;
      try {
        data = await response.json();
        console.log("[CouponCode] Validation response:", data);
      } catch (jsonError) {
        console.error("JSON Parse Error:", jsonError);
        throw new Error("Invalid response from server");
      }

      if (data.success && data.data.isValid) {
        console.log("[CouponCode] Coupon is valid, applying...");
        setAppliedCoupon({
          coupon: data.data.coupon,
          calculation: data.data.calculation,
          message: "Coupon applied",
        });
        setCouponInputValue(data.data.coupon.code);
        showToast(`Coupon applied: ${data.data.coupon.name}`, "success");
        setUserManuallyRemoved(false);
        // Notify parent
        onCouponApplied(data.data.coupon, data.data.calculation);
      } else {
        console.log(
          "[CouponCode] Coupon is invalid, showing error:",
          data.data?.error
        );
        // Clear any applied coupon
        setAppliedCoupon(null);
        setCouponError(data.data?.error || "Invalid coupon code");
        showToast(data.data?.error || "Invalid coupon code", "error");
        // Set flag to prevent auto-reapply
        setUserManuallyRemoved(true);
        // Notify parent
        onCouponRemoved();
      }
    } catch (error) {
      console.error("Failed to validate coupon:", error);
      setCouponError("Failed to validate coupon. Please try again.");
      showToast("Failed to validate coupon", "error");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  // Handle coupon removal (NO auto-reapply)
  const handleRemoveCoupon = () => {
    setCouponInputValue("");
    setAppliedCoupon(null);
    setCouponError("");
    setUserManuallyRemoved(true); // Set flag to prevent auto-reapply
    showToast("Coupon removed", "info");
    // Notify parent
    onCouponRemoved();
  };

  // Handle input change - DO NOT auto-apply, let user click Apply button
  const handleCouponInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setCouponInputValue(value);
    setCouponError(""); // Clear error when user types
  };

  // Handle Enter key press on input
  const handleCouponInputKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (couponInputValue.trim()) {
        handleApplyCoupon();
      }
    }
  };

  // Handle dropdown selection - apply immediately
  const handleSelectCoupon = async (code: string) => {
    setCouponInputValue(code);
    setShowDropdown(false);
    setCouponError("");
    setIsApplyingCoupon(true);

    try {
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          programId,
          currency: selectedCurrency,
          orderAmount,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        throw new Error(`Server error: ${response.status}`);
      }

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error("JSON Parse Error:", jsonError);
        throw new Error("Invalid response from server");
      }

      if (data.success && data.data.isValid) {
        setAppliedCoupon({
          coupon: data.data.coupon,
          calculation: data.data.calculation,
          message: "Coupon applied",
        });
        showToast(`Coupon applied: ${data.data.coupon.name}`, "success");
        setUserManuallyRemoved(false);
        // Notify parent
        onCouponApplied(data.data.coupon, data.data.calculation);
      } else {
        // Clear any applied coupon
        setAppliedCoupon(null);
        setCouponError(data.data?.error || "Invalid coupon code");
        showToast(data.data?.error || "Invalid coupon code", "error");
        setUserManuallyRemoved(true);
        // Notify parent
        onCouponRemoved();
      }
    } catch (error) {
      console.error("Failed to validate coupon:", error);
      setCouponError("Failed to validate coupon. Please try again.");
      showToast("Failed to validate coupon", "error");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  return (
    <div className="border-t border-gray-200 pt-3">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Coupon Code
      </label>

      {/* Single input with custom dropdown */}
      <div className="flex gap-2">
        <div className="flex-1 relative" ref={dropdownRef}>
          <div className="relative">
            <input
              type="text"
              value={couponInputValue}
              onChange={handleCouponInputChange}
              onKeyPress={handleCouponInputKeyPress}
              placeholder={
                isLoadingCoupons
                  ? "Loading coupons..."
                  : availableCoupons.length > 0
                  ? "Select or enter coupon code"
                  : "Enter coupon code"
              }
              disabled={isApplyingCoupon || isLoadingCoupons || disabled}
              className={`w-full px-3 py-2 pr-8 border text-sm focus:ring-2 focus:outline-none disabled:bg-gray-100 ${
                appliedCoupon
                  ? "border-gray-300 focus:ring-blue-500"
                  : couponError
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {availableCoupons.length > 0 && !isLoadingCoupons && (
              <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Custom dropdown */}
          {showDropdown && availableCoupons.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
              {availableCoupons.map((coupon) => (
                <button
                  key={coupon.code}
                  type="button"
                  onClick={() => handleSelectCoupon(coupon.code)}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-blue-50 focus:bg-blue-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                >
                  <div className="font-medium text-gray-900">{coupon.code}</div>
                  <div className="text-xs text-gray-600">
                    {coupon.name} -{" "}
                    {coupon.type === "percentage"
                      ? `${coupon.value}%`
                      : formatCurrency(coupon.value, selectedCurrency)}{" "}
                    off
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        {appliedCoupon && appliedCoupon.coupon?.code === couponInputValue ? (
          <button
            onClick={handleRemoveCoupon}
            disabled={isApplyingCoupon || disabled}
            className="px-4 py-2 text-sm font-medium text-red-600 border border-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            Remove
          </button>
        ) : (
          <button
            onClick={handleApplyCoupon}
            disabled={
              !couponInputValue ||
              isApplyingCoupon ||
              isLoadingCoupons ||
              disabled
            }
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isApplyingCoupon ? "Applying..." : "Apply"}
          </button>
        )}
      </div>

      {/* Applied coupon info */}
      {appliedCoupon && !couponError && (
        <p className="text-xs text-green-600 mt-2">
          Applied: {appliedCoupon.coupon?.name}
        </p>
      )}

      {/* Error display */}
      {couponError && !appliedCoupon && (
        <p className="text-xs text-red-600 mt-2">{couponError}</p>
      )}

      {/* Hint text */}
      {!appliedCoupon && !couponError && availableCoupons.length > 0 && (
        <p className="text-xs text-gray-500 mt-2">
          Click the dropdown arrow to see available coupons
        </p>
      )}

      {/* Discount Display */}
      {appliedCoupon && (
        <div className="flex justify-between items-center text-green-600 mt-3">
          <span className="text-sm">
            Discount (
            {appliedCoupon.coupon?.type === "percentage"
              ? `${appliedCoupon.coupon?.value}%${
                  appliedCoupon.coupon?.maxDiscountAmount
                    ? ` max ${formatCurrency(
                        appliedCoupon.coupon.maxDiscountAmount,
                        selectedCurrency
                      )}`
                    : ""
                }`
              : formatCurrency(
                  appliedCoupon.coupon?.value || 0,
                  selectedCurrency
                )}
            )
          </span>
          <span className="font-medium">
            -
            {formatCurrency(
              appliedCoupon.calculation?.discountAmount || 0,
              selectedCurrency
            )}
          </span>
        </div>
      )}
    </div>
  );
};
