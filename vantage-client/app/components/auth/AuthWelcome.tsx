"use client";

import React from "react";
import Image from "next/image";

interface AuthWelcomeProps {
  title: string;
  subtitle: string;
}

const AuthWelcome: React.FC<AuthWelcomeProps> = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex lg:w-[70%] relative bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/assets/auth-bg.jpg"
          alt="Background"
          fill
          className="object-cover opacity-60"
          priority
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/50"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center items-center text-center text-white p-12">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-6 font-section-heading">
            {title}
          </h1>
          <p className="text-lg text-gray-200 leading-relaxed">{subtitle}</p>
        </div>

        {/* Logo */}
        <div className="mt-12">
          <Image
            src="/assets/vantage-logo-light.png"
            alt="Vantage Logo"
            width={200}
            height={60}
            className="opacity-90"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthWelcome;

