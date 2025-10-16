"use client";

import { Suspense } from "react";
import SignUpForm from "@/components/auth/SignUpForm";
import Spinner from "@/components/ui/loader/Spinner";
import AuthWelcome from "@/components/auth/AuthWelcome";

export default function SignUp() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Background Image and Branding (70%) */}
      <AuthWelcome
        title="Join Vantage Institute"
        subtitle="Start your journey in high finance with industry leaders. Build the skills and network to accelerate your career in global finance."
      />

      {/* Right Side - Sign Up Form (30%) */}
      <div className="w-full lg:w-[30%] flex items-center justify-center p-6 bg-white border-l border-gray-200">
        <div className="w-full h-full p-4 max-w-sm">
          <Suspense fallback={<Spinner />}>
            <SignUpForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
