"use client";

import React from "react";
import { usePricing } from "@/hooks/usePricing";
import { CourseDetailsCard } from "./CourseDetailsCard";
import { useAuth } from "@/providers/AuthProvider";

interface ProgramData {
  programId: string;
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  mode?: string;
  tags?: string[];
}

interface AuthenticatedCheckoutFormProps {
  programId: string;
  programData: ProgramData;
  onSuccess?: (orderData: Record<string, unknown>) => void;
  onError?: (error: Record<string, unknown>) => void;
  className?: string;
}

export const AuthenticatedCheckoutForm: React.FC<
  AuthenticatedCheckoutFormProps
> = ({ programId, programData, onSuccess, onError, className = "" }) => {
  const { user } = useAuth();

  // Use the pricing hook
  const {
    pricing,
    selectedCurrency,
    isLoading: isPricingLoading,
    setSelectedCurrency,
    hasPricing,
    availableCurrencies,
    isLoadingCurrencies,
  } = usePricing({
    programId,
    initialCurrency: "INR",
    debounceDelay: 500,
    autoUpdate: true,
  });

  return (
    <div className={`${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - User Information (Pre-filled) */}
        <div className="order-1 lg:order-1">
          <div>
            <div className="space-y-6">
              {/* User Information */}
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 bg-gray-50 text-gray-600 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={user?.name || ""}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 bg-gray-50 text-gray-600 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Account Info */}
              <div className="">
                <div className="bg-green-50 p-4">
                  <h4 className="font-semibold text-green-900 mb-2">
                    Account Information
                  </h4>
                  <p className="text-sm text-green-700 mb-3">
                    You&apos;re signed in as <strong>{user?.email}</strong>.
                    Your order will be linked to this account.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-600">Not you?</span>
                    <button
                      type="button"
                      onClick={() => {
                        localStorage.removeItem("authToken");
                        window.location.href = "/signin";
                      }}
                      className="text-sm text-green-600 hover:text-green-800 underline font-medium"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Course Details */}
        <div className="order-2 lg:order-2">
          <CourseDetailsCard
            programId={programId}
            programData={programData}
            pricing={pricing}
            selectedCurrency={selectedCurrency}
            onCurrencyChange={setSelectedCurrency}
            isLoading={isPricingLoading}
            availableCurrencies={availableCurrencies}
            isLoadingCurrencies={isLoadingCurrencies}
            isSubmitting={false}
            hasPricing={hasPricing}
            isPricingLoading={isPricingLoading}
            isGuestCheckout={false}
            onSuccess={onSuccess}
            onError={onError}
            isGuestFormInvalid={false}
          />
        </div>
      </div>
    </div>
  );
};
