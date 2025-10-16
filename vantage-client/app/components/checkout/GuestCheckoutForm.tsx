"use client";

import React, { useState } from "react";
import { usePricing } from "@/hooks/usePricing";
import { CourseDetailsCard } from "./CourseDetailsCard";

interface ProgramData {
  programId: string;
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  mode?: string;
  tags?: string[];
}

interface GuestCheckoutFormProps {
  programId: string;
  programData: ProgramData;
  onSuccess?: (orderData: Record<string, unknown>) => void;
  onError?: (error: Record<string, unknown>) => void;
  className?: string;
}

export const GuestCheckoutForm: React.FC<GuestCheckoutFormProps> = ({
  programId,
  programData,
  onSuccess,
  onError,
  className = "",
}) => {
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

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Real-time validation for guest inputs (used for inline feedback)
  // Only show errors for invalid format, not for empty fields (the * already indicates required)
  const emailError =
    formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
      ? "Please enter a valid email address"
      : "";

  const nameError = ""; // No inline error for name, just required indicator

  const phoneError =
    formData.phone.trim() &&
    !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ""))
      ? "Please enter a valid phone number"
      : "";

  return (
    <div className={`${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - User Form */}
        <div className="order-1 lg:order-1">
          <div>
            <div className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="your@email.com"
                  />
                  {emailError && (
                    <p className="mt-1 text-xs text-red-600">{emailError}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="John Doe"
                  />
                  {nameError && (
                    <p className="mt-1 text-xs text-red-600">{nameError}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Phone Number{" "}
                    <span className="text-gray-500">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="+1 234 567 8900"
                  />
                  {phoneError && (
                    <p className="mt-1 text-xs text-red-600">{phoneError}</p>
                  )}
                </div>
              </div>

              {/* Account Options */}
              <div className="">
                <div className="bg-blue-50 p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Account Information
                  </h4>
                  <p className="text-sm text-blue-700 mb-3">
                    We&apos;ll create a guest account for you and send login
                    credentials to your email address.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-600">
                      Already have an account?
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const email = formData.email.trim();
                        const callbackUrl = `/checkout?programId=${programData.slug}`;
                        window.location.href = `/signin?email=${encodeURIComponent(
                          email
                        )}&callbackUrl=${encodeURIComponent(callbackUrl)}`;
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800 underline font-medium"
                    >
                      Sign in instead
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
            isGuestCheckout={true}
            guestFormData={formData}
            onSuccess={onSuccess}
            onError={onError}
            isGuestFormInvalid={
              !formData.email.trim() ||
              !formData.name.trim() ||
              !!emailError ||
              !!nameError ||
              !!phoneError
            }
          />
        </div>
      </div>
    </div>
  );
};
