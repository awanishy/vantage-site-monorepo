"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { GuestCheckoutForm } from "@/components/checkout/GuestCheckoutForm";
import { AuthenticatedCheckoutForm } from "@/components/checkout/AuthenticatedCheckoutForm";
import { useAuth } from "@/providers/AuthProvider";
import NavbarCheckout from "../components/NavbarCheckout";

interface ProgramData {
  programId: string;
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  mode?: string;
  tags?: string[];
}

const CheckoutContent = () => {
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading } = useAuth();
  const [programData, setProgramData] = useState<ProgramData | null>(null);
  const [isLoadingProgram, setIsLoadingProgram] = useState(false);

  useEffect(() => {
    const programSlugParam = searchParams.get("programId"); // This is actually the slug
    if (programSlugParam) {
      fetchProgramData(programSlugParam);
    } else {
      // Redirect to programs page if no programId
      window.location.href = "/fellowships";
    }
  }, [searchParams]);

  const fetchProgramData = async (slug: string) => {
    setIsLoadingProgram(true);
    try {
      const response = await fetch(`/api/courses/${slug}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data?.program) {
          const program = data.data.program;
          setProgramData({
            programId: program.programId,
            slug: program.slug,
            title: program.title,
            subtitle: program.subtitle,
            description: program.description,
            mode: program.mode,
            tags: program.tags,
          });
        } else {
          console.error("Failed to fetch program data:", data);
          window.location.href = "/fellowships";
        }
      } else {
        console.error("Failed to fetch program data");
        window.location.href = "/fellowships";
      }
    } catch (error) {
      console.error("Error fetching program data:", error);
      window.location.href = "/fellowships";
    } finally {
      setIsLoadingProgram(false);
    }
  };

  if (isLoading || isLoadingProgram || !programData) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">
              {isLoadingProgram
                ? "Loading program details..."
                : "Loading checkout..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleCheckoutSuccess = (orderData: Record<string, unknown>) => {
    // Redirect to success page or show success message
    const orderId = (orderData?.orderId as string) || "";
    window.location.href = `/my-orders?success=true&orderId=${orderId}`;
  };

  const handleCheckoutError = (error: Record<string, unknown>) => {
    console.error("Checkout error:", error);
    // Error handling is done in the individual forms
  };

  return (
    <div>
      <NavbarCheckout />
      <div className="min-h-screen  bg-gray-50 flex items-center justify-center pt-14">
        <div className="max-w-5xl mx-auto px-4">
          {/* Unified Parent Container */}
          <div className="bg-white shadow-lg border border-gray-200 p-6 lg:p-8 mb-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Checkout
              </h1>
              <p className="text-gray-600">
                {isAuthenticated
                  ? "Complete your payment to enroll in this program."
                  : "Enter your details to proceed with payment."}
              </p>
            </div>
            {isAuthenticated ? (
              <AuthenticatedCheckoutForm
                programId={programData.programId}
                programData={programData}
                onSuccess={handleCheckoutSuccess}
                onError={handleCheckoutError}
              />
            ) : (
              <GuestCheckoutForm
                programId={programData.programId}
                programData={programData}
                onSuccess={handleCheckoutSuccess}
                onError={handleCheckoutError}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CheckoutPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading checkout...</p>
            </div>
          </div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
};

export default CheckoutPage;
