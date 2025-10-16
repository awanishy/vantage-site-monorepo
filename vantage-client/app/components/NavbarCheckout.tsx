"use client";

import Link from "next/link";
import Image from "next/image";

export default function NavbarCheckout() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-black/95 backdrop-blur-md border-b border-primary/30 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/assets/vantage-logo-light.png"
                alt="Vantage Logo"
                width={150}
                height={50}
                priority
              />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
