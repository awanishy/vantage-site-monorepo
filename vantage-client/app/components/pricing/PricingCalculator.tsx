"use client";

import React, { useState, useEffect } from "react";
import { usePricing } from "@/hooks";
import { CurrencyOption } from "@/types";

interface PricingData {
  pricing: {
    tuition: number;
    currency: string;
    taxesIncluded: boolean;
    totalAmount: number;
  };
  fx?: {
    rate: number;
    conversionDate: string;
  };
  programCurrency?: string;
}

interface PricingCalculatorProps {
  programId: string;
  onPricingUpdate?: (pricing: PricingData) => void;
  className?: string;
}

const CURRENCY_OPTIONS: CurrencyOption[] = [
  {
    code: "INR",
    name: "Indian Rupee",
    symbol: "₹",
    flag: "🇮🇳",
    isPopular: true,
  },
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸", isPopular: true },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺", isPopular: false },
  {
    code: "GBP",
    name: "British Pound",
    symbol: "£",
    flag: "🇬🇧",
    isPopular: false,
  },
];

export const PricingCalculator: React.FC<PricingCalculatorProps> = ({
  programId,
  onPricingUpdate,
  className = "",
}) => {
  const {
    pricing,
    selectedCurrency,
    setSelectedCurrency,
    isLoading,
    error,
    updatePricing,
  } = usePricing({ programId });

  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (pricing && onPricingUpdate) {
      onPricingUpdate(pricing);
    }
  }, [pricing, onPricingUpdate]);

  const handleCurrencyChange = async (currency: string) => {
    if (currency === selectedCurrency) return;

    setIsUpdating(true);
    try {
      await updatePricing(programId, currency);
      setSelectedCurrency(currency);
    } catch (error) {
      console.error("Failed to update pricing:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  if (error) {
    return (
      <div
        className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}
      >
        <div className="flex items-center">
          <div className="text-red-600 text-sm">
            <p className="font-medium">Pricing Error</p>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Program Pricing</h3>
        {isLoading && (
          <div className="flex items-center text-sm text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            Updating...
          </div>
        )}
      </div>

      {/* Currency Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Currency
        </label>
        <div className="grid grid-cols-2 gap-2">
          {CURRENCY_OPTIONS.map((currency) => (
            <button
              key={currency.code}
              onClick={() => handleCurrencyChange(currency.code)}
              disabled={isUpdating}
              className={`flex items-center justify-center p-3 rounded-lg border transition-colors ${
                selectedCurrency === currency.code
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              } ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <span className="text-lg mr-2">{currency.flag}</span>
              <div className="text-left">
                <div className="font-medium text-sm">{currency.code}</div>
                <div className="text-xs text-gray-500">{currency.name}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Pricing Display */}
      {pricing && (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">
                Tuition Fee
              </span>
              <span className="text-lg font-semibold text-gray-900">
                {formatAmount(
                  pricing.pricing.tuition,
                  pricing.pricing.currency
                )}
              </span>
            </div>

            {pricing.fx && (
              <div className="text-xs text-gray-500 mb-2">
                Converted from {pricing.programCurrency} at rate{" "}
                {pricing.fx.rate.toFixed(4)}
              </div>
            )}

            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">
                {pricing.pricing.taxesIncluded
                  ? "Taxes included"
                  : "Taxes not included"}
              </span>
              <span className="font-medium text-gray-900">
                Total:{" "}
                {formatAmount(
                  pricing.pricing.totalAmount,
                  pricing.pricing.currency
                )}
              </span>
            </div>
          </div>

          {pricing.fx && (
            <div className="text-xs text-gray-500 text-center">
              Exchange rate as of{" "}
              {new Date(pricing.fx.conversionDate).toLocaleDateString()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
