"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers";
import Spinner from "@/components/ui/loader/Spinner";

const LogoutPage = () => {
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        logout();
        router.push("/");
      } catch (error) {
        console.error("Logout failed", error);
        // Even if logout fails, redirect to home
        router.push("/");
      }
    };

    handleLogout();
  }, [router, logout]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-600">Signing you out...</p>
      </div>
    </div>
  );
};

export default LogoutPage;
