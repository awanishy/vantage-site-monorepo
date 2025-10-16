"use client";

import { Suspense } from "react";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import Spinner from "@/components/ui/loader/Spinner";
import AuthWelcome from "@/components/auth/AuthWelcome";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Background Image and Branding (70%) */}
      <AuthWelcome
        title="Reset Your Password"
        subtitle="Enter your email address and we'll send you a verification code to reset your password securely."
      />

      {/* Right Side - Reset Password Form (30%) */}
      <div className="w-full lg:w-[30%] flex items-center justify-center p-6 bg-white border-l border-gray-200">
        <div className="w-full h-full p-4 max-w-sm">
          <Suspense fallback={<Spinner />}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
