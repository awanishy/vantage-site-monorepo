"use client";

import { Suspense } from "react";
import EmailVerificationForm from "@/components/auth/EmailVerificationForm";
import Spinner from "@/components/ui/loader/Spinner";
import AuthWelcome from "@/components/auth/AuthWelcome";

export default function VerifyEmail() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Background Image and Branding (70%) */}
      <AuthWelcome
        title="Verify Your Email"
        subtitle="We've sent a verification code to your email address. Please enter the code below to activate your account."
      />

      {/* Right Side - Email Verification Form (30%) */}
      <div className="w-full lg:w-[30%] flex items-center justify-center p-6 bg-white border-l border-gray-200">
        <div className="w-full h-full p-4 max-w-sm">
          <Suspense fallback={<Spinner />}>
            <EmailVerificationForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
