"use client";

import React, { useState } from "react";
import { PricingState, CurrencyOption } from "@/types";
import { usePayment } from "@/providers/PaymentProvider";
import { useToast } from "@/providers/ToastProvider";
import { openCashfreePayment } from "../../utils/cashfreePayment";
import Image from "next/image";

interface VerificationResult {
  success: boolean;
  data?: {
    orderId: string;
    orderNumber?: string;
    cfOrderId?: string;
    paymentId?: string;
    paymentStatus: string;
    paymentAmount?: number;
    paymentCurrency?: string;
    paymentTime?: string;
    paymentCompletionTime?: string;
    bankReference?: string;
    paymentMessage?: string;
  };
  message?: string;
  error?: string;
}

interface ProgramData {
  programId: string;
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  mode?: string;
  tags?: string[];
}

interface CourseDetailsCardProps {
  programId: string;
  programData: ProgramData;
  pricing: PricingState | null;
  selectedCurrency: string;
  onCurrencyChange: (currency: string) => void;
  isLoading: boolean;
  availableCurrencies?: CurrencyOption[];
  isLoadingCurrencies?: boolean;
  className?: string;
  isSubmitting: boolean;
  hasPricing: boolean;
  isPricingLoading: boolean;
  // Guest checkout specific props
  isGuestCheckout?: boolean;
  guestFormData?: {
    email: string;
    name: string;
    phone: string;
  };
  isGuestFormInvalid?: boolean;
  onSuccess?: (orderData: Record<string, unknown>) => void;
  onError?: (error: Record<string, unknown>) => void;
}

export const CourseDetailsCard: React.FC<CourseDetailsCardProps> = ({
  programId,
  programData,
  pricing,
  selectedCurrency,
  onCurrencyChange,
  isLoading,
  availableCurrencies = [],
  isLoadingCurrencies = false,
  className = "",
  isSubmitting,
  hasPricing,
  isPricingLoading,
  isGuestCheckout = false,
  guestFormData,
  isGuestFormInvalid = false,
  onSuccess,
  onError,
}) => {
  const {
    createGuestUser,
    createGuestOrder,
    createGuestPaymentSession,
    createOrder,
    createPaymentSession,
    verifyPayment,
  } = usePayment();
  const { showToast } = useToast();
  const [internalIsSubmitting, setInternalIsSubmitting] = useState(false);

  // Verification modal state
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState<
    "verifying" | "success" | "failed" | "pending"
  >("verifying");
  const [verifyTitle, setVerifyTitle] = useState("Verifying payment...");
  const [verifyMessage, setVerifyMessage] = useState(
    "Please wait while we confirm your payment with our provider."
  );

  // Use only backend currencies - no fallback
  const currencyOptions = availableCurrencies;

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Validation is now handled in GuestCheckoutForm and passed via prop

  const handlePaymentSuccess = async (paymentData: Record<string, unknown>) => {
    try {
      // Open verification modal
      setIsVerifyModalOpen(true);
      setVerifyStatus("verifying");
      setVerifyTitle("Verifying payment...");
      setVerifyMessage(
        "Please wait while we confirm your payment with our provider."
      );

      let verificationResult: VerificationResult;
      if (isGuestCheckout && guestFormData) {
        // Verify guest payment via guest endpoint proxy
        const resp = await fetch(
          `/api/payments/guest/orders/${String(paymentData.orderId)}/verify`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: guestFormData.email }),
          }
        );
        verificationResult = await resp.json();
      } else {
        verificationResult = await verifyPayment(paymentData.orderId as string);
      }

      if (
        verificationResult.success &&
        verificationResult.data?.paymentStatus === "SUCCESS"
      ) {
        setVerifyStatus("success");
        setVerifyTitle("Payment Verified");
        setVerifyMessage(
          "Your payment has been verified successfully. Redirecting to your orders..."
        );
        if (isGuestCheckout && guestFormData) {
          showToast(
            "Payment successful! Sending verification email...",
            "success"
          );

          // Send verification email for guest user
          try {
            const emailResponse = await fetch(
              "/api/users/auth/send-verification",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  email: guestFormData.email,
                  isGuestUser: true,
                }),
              }
            );

            if (emailResponse.ok) {
              showToast(
                "Verification email sent! Please check your inbox.",
                "success"
              );
            } else {
              console.warn(
                "Failed to send verification email, but payment was successful"
              );
            }
          } catch (emailError) {
            console.warn("Error sending verification email:", emailError);
          }

          // Call onSuccess before redirect
          onSuccess?.(verificationResult.data);

          // Redirect to email verification page with email parameter
          setTimeout(() => {
            const verifyEmailUrl = `/verify-email?email=${encodeURIComponent(
              guestFormData.email
            )}&callbackUrl=${encodeURIComponent("/my-orders")}&isGuest=true`;
            window.location.href = verifyEmailUrl;
          }, 1200);
        } else {
          // Authenticated user - redirect to my-orders
          showToast("Payment successful! Redirecting...", "success");
          onSuccess?.(verificationResult.data);

          setTimeout(() => {
            window.location.href = `/my-orders?success=true&orderId=${
              verificationResult.data?.orderId || ""
            }`;
          }, 1200);
        }
      } else {
        // Payment not successful yet (might be pending)
        console.log("Payment verification result:", verificationResult);
        const isPending =
          verificationResult.success &&
          verificationResult.data?.paymentStatus !== "SUCCESS";
        setVerifyStatus(isPending ? "pending" : "failed");
        setVerifyTitle(
          isPending ? "Payment Pending" : "Payment Verification Failed"
        );
        setVerifyMessage(
          isPending
            ? "Your payment is being processed. You can check your My Orders page for the latest status. If the amount has been debited, please wait 10-15 minutes before trying again."
            : "We couldn't verify your payment right now. If the amount has been debited, please wait 10-15 minutes before making another attempt, or get in touch with us."
        );
        // For pending, nudge user to My Orders after a short delay
        if (isPending) {
          setTimeout(() => {
            window.location.href = "/my-orders";
          }, 2500);
        }
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      setIsVerifyModalOpen(true);
      setVerifyStatus("failed");
      setVerifyTitle("Payment Verification Failed");
      setVerifyMessage(
        "An error occurred while verifying your payment. If the amount has been debited, please wait 10-15 minutes before trying again, or get in touch with us."
      );
      onError?.(error as Record<string, unknown>);
    }
  };

  const handlePaymentFailure = async (error: Record<string, unknown>) => {
    console.error("Payment failed:", error);

    // If we have an orderId, verify payment status anyway
    if (error.orderId) {
      try {
        setIsVerifyModalOpen(true);
        setVerifyStatus("verifying");
        setVerifyTitle("Verifying payment...");
        setVerifyMessage(
          "Please wait while we confirm your payment with our provider."
        );
        let verificationResult: VerificationResult;
        if (isGuestCheckout && guestFormData) {
          const resp = await fetch(
            `/api/payments/guest/orders/${String(error.orderId)}/verify`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: guestFormData.email }),
            }
          );
          verificationResult = await resp.json();
        } else {
          verificationResult = await verifyPayment(error.orderId as string);
        }

        if (
          verificationResult.success &&
          verificationResult.data?.paymentStatus === "SUCCESS"
        ) {
          setVerifyStatus("success");
          setVerifyTitle("Payment Verified");
          setVerifyMessage(
            "Your payment has been verified successfully. Redirecting to your orders..."
          );
          if (isGuestCheckout && guestFormData) {
            showToast(
              "Payment was actually successful! Sending verification email...",
              "success"
            );

            // Send verification email for guest user
            try {
              const emailResponse = await fetch(
                "/api/users/auth/send-verification",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    email: guestFormData.email,
                    isGuestUser: true,
                  }),
                }
              );

              if (emailResponse.ok) {
                showToast(
                  "Verification email sent! Please check your inbox.",
                  "success"
                );
              } else {
                console.warn(
                  "Failed to send verification email, but payment was successful"
                );
              }
            } catch (emailError) {
              console.warn("Error sending verification email:", emailError);
            }

            // Call onSuccess before redirect
            onSuccess?.(verificationResult.data);

            setTimeout(() => {
              const verifyEmailUrl = `/verify-email?email=${encodeURIComponent(
                guestFormData.email
              )}&callbackUrl=${encodeURIComponent("/my-orders")}&isGuest=true`;
              window.location.href = verifyEmailUrl;
            }, 1200);
          } else {
            // Authenticated user
            showToast(
              "Payment was actually successful! Redirecting...",
              "success"
            );
            onSuccess?.(verificationResult.data);
            setTimeout(() => {
              window.location.href = `/my-orders?success=true&orderId=${
                verificationResult.data?.orderId || ""
              }`;
            }, 1200);
          }
          return;
        }
      } catch (verifyError) {
        console.error("Payment verification error:", verifyError);
      }
    }
    setVerifyStatus("failed");
    setVerifyTitle("Payment Failed");
    setVerifyMessage(
      "Your payment was not completed. If the amount has been debited, please wait 10-15 minutes before trying again, or get in touch with us."
    );
    onError?.(error);
  };

  const handleProceedToPayment = async () => {
    if (isPricingLoading || !hasPricing || !pricing) {
      showToast("Please wait for pricing to load", "error");
      return;
    }

    if (isGuestCheckout && isGuestFormInvalid) {
      showToast("Please fill in all required fields correctly", "error");
      return;
    }

    setInternalIsSubmitting(true);

    try {
      if (isGuestCheckout && guestFormData) {
        showToast("Creating guest account...", "info");
        const guestUser = await createGuestUser({
          email: guestFormData.email,
          name: guestFormData.name,
          phone: guestFormData.phone,
        });

        if (!guestUser) {
          return;
        }

        showToast("Creating order...", "info");
        const order = await createGuestOrder({
          programId,
          selectedCurrency,
          guestUserId: guestUser.userId,
        });

        showToast("Preparing payment...", "info");
        const session = await createGuestPaymentSession(
          order.orderId,
          guestFormData.email
        );

        await openCashfreePayment({
          paymentSession: session,
          onSuccess: handlePaymentSuccess,
          onFailure: handlePaymentFailure,
          onClose: () => {},
        });
      } else {
        showToast("Creating order...", "info");
        const order = await createOrder({
          programId,
          selectedCurrency,
        });

        showToast("Preparing payment...", "info");
        const session = await createPaymentSession(order.orderId);

        await openCashfreePayment({
          paymentSession: session,
          onSuccess: handlePaymentSuccess,
          onFailure: handlePaymentFailure,
          onClose: () => {},
        });
      }

      showToast("Payment ready! Please complete your payment.", "success");
    } catch (error: unknown) {
      console.error("Checkout error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Checkout failed. Please try again.";
      showToast(errorMessage, "error");
      onError?.(error as Record<string, unknown>);
    } finally {
      setInternalIsSubmitting(false);
    }
  };

  return (
    <div className={`${className}`}>
      {isVerifyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white w-full max-w-md mx-4 rounded shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              {verifyStatus === "verifying" && (
                <svg
                  className="animate-spin h-5 w-5 text-blue-600"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"
                  ></path>
                </svg>
              )}
              {verifyStatus === "success" && (
                <svg
                  className="h-5 w-5 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
              {verifyStatus !== "verifying" && verifyStatus !== "success" && (
                <svg
                  className="h-5 w-5 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01M12 5a7 7 0 100 14 7 7 0 000-14z"
                  />
                </svg>
              )}
              <h3 className="text-lg font-semibold text-gray-900">
                {verifyTitle}
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">{verifyMessage}</p>
            <div className="flex items-center justify-end gap-2">
              {verifyStatus === "failed" && (
                <>
                  <button
                    className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200"
                    onClick={() => setIsVerifyModalOpen(false)}
                  >
                    Stay on Checkout
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => (window.location.href = "/my-orders")}
                  >
                    Go to My Orders
                  </button>
                </>
              )}
              {verifyStatus === "pending" && (
                <button
                  className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => (window.location.href = "/my-orders")}
                >
                  View My Orders
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Program Header */}
      <div className="mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {programData.title}
        </h2>
        {programData.subtitle && (
          <p className="text-gray-600 text-sm mb-2">{programData.subtitle}</p>
        )}
        {/* {programData.mode && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="capitalize">{programData.mode}</span>
            {programData.tags && programData.tags.length > 0 && (
              <>
                <span>•</span>
                <span>{programData.tags.join(" • ")}</span>
              </>
            )}
          </div>
        )} */}
      </div>

      {/* Course Details */}
      <div className="space-y-4">
        {/* Pricing Section */}
        <div className="">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Pricing</h3>
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Currency:</label>
              {/* Currency Flag */}
              {!isLoadingCurrencies && currencyOptions.length > 0 && (
                <div className="relative w-6 h-6">
                  <Image
                    src={
                      currencyOptions.find((c) => c.code === selectedCurrency)
                        ?.flag || ""
                    }
                    alt={selectedCurrency}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              <select
                value={selectedCurrency}
                onChange={(e) => onCurrencyChange(e.target.value)}
                disabled={
                  isLoading ||
                  isLoadingCurrencies ||
                  currencyOptions.length === 0
                }
                className="px-3 py-1 border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              >
                {isLoadingCurrencies ? (
                  <option value={selectedCurrency}>
                    Loading currencies...
                  </option>
                ) : currencyOptions.length === 0 ? (
                  <option value={selectedCurrency}>
                    No currencies available
                  </option>
                ) : (
                  currencyOptions.map((option) => (
                    <option key={option.code} value={option.code}>
                      {option.code}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2"></div>
            </div>
          ) : pricing ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tuition Fee</span>
                <span className="font-medium">
                  {formatCurrency(pricing.pricing.tuition, selectedCurrency)}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total Amount</span>
                  <span className="text-blue-600">
                    {formatCurrency(
                      pricing.pricing.totalAmount,
                      selectedCurrency
                    )}
                  </span>
                </div>
                {pricing.pricing.taxesIncluded && (
                  <p className="text-xs text-gray-500 mt-1">*Taxes included</p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-4">
              <p>Unable to load pricing information</p>
            </div>
          )}
        </div>

        {/* Security Badge */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <svg
              className="w-4 h-4 text-green-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>Secure payment powered by Cashfree</span>
          </div>
        </div>
        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="button"
            onClick={handleProceedToPayment}
            disabled={
              isSubmitting ||
              internalIsSubmitting ||
              !hasPricing ||
              isGuestFormInvalid
            }
            className={`w-full text-white py-4 px-6 font-semibold text-lg transition-colors shadow-lg transform hover:-translate-y-0.5
              ${
                isSubmitting ||
                internalIsSubmitting ||
                !hasPricing ||
                isGuestFormInvalid
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 hover:shadow-xl"
              }
            `}
          >
            {isSubmitting || internalIsSubmitting ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </div>
            ) : (
              "Proceed to Payment"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
