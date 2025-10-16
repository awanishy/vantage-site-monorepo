"use client";

import { Suspense } from "react";
import SignInForm from "@/components/auth/SignInForm";
import Spinner from "@/components/ui/loader/Spinner";
import AuthWelcome from "@/components/auth/AuthWelcome";

export default function SignIn() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Background Image and Branding (70%) */}
      <AuthWelcome
        title="Welcome to Vantage Institute"
        subtitle="Learn from the leaders who shaped trillion-dollar finance. Join our community of ambitious learners and industry practitioners."
      />

      {/* Right Side - Sign In Form (30%) */}
      <div className="w-full lg:w-[30%] flex items-center justify-center p-6 bg-white border-l border-gray-200">
        <div className="w-full h-full p-4 max-w-sm">
          <Suspense fallback={<Spinner />}>
            <SignInForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
