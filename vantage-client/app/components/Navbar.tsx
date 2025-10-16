"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

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

          {/* Navigation Items (Desktop) */}
          <div className="hidden md:block">
            <div
              className="ml-10 flex items-baseline space-x-8"
              style={{
                fontFamily: '"Sofia Pro Light", serif',
              }}
            >
              <Link
                href="/#meet-founders"
                className="text-white px-6 py-2 text-base font-light transition-all duration-200 hover:text-accent hover:underline decoration-2 underline-offset-4"
                // onClick={(e) => e.preventDefault()}
              >
                Team
              </Link>
              <Link
                href="/#learning-practitioners"
                className="text-white px-6 py-2 text-base font-light transition-all duration-200 hover:text-accent hover:underline decoration-2 underline-offset-4"
                // onClick={(e) => e.preventDefault()}
              >
                Learning
              </Link>
              <Link
                href="/fellowships"
                className="text-white px-6 py-2 text-base font-light transition-all duration-200 hover:text-accent hover:underline decoration-2 underline-offset-4"
              >
                B&F Fellowship
              </Link>

              <Link
                href="https://forms.gle/Q8sXzoUZ7Sh3KHyR6"
                target="_blank"
                className="text-white px-6 py-2 text-base font-light transition-all duration-200 hover:text-accent hover:underline decoration-2 underline-offset-4"
                // onClick={(e) => e.preventDefault()}
              >
                PG Programme{" "}
                <span
                  className="text-[#a5d2b1] font-semibold"
                  style={{
                    fontFamily: '"Chronicle Display Black", serif',
                    fontStyle: "italic",
                    fontSize: "14px",
                  }}
                >
                  (Coming Soon)
                </span>
              </Link>
            </div>
          </div>

          {/* Right Controls (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="https://forms.gle/Q8sXzoUZ7Sh3KHyR6"
              target="_blank"
              className="bg-[#a5d2b1] text-black px-6 py-2 rounded-md text-sm font-semibold hover:bg-yellow-600 transition-colors duration-200"
            >
              Apply Now
            </Link>

            {/* User/Profile Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                aria-label="User menu"
                onClick={(e) => {
                  e.stopPropagation();
                  setUserMenuOpen((s) => !s);
                }}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                {isAuthenticated ? (
                  <span className="text-white text-sm font-semibold">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                ) : (
                  <svg
                    className="w-5 h-5 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                )}
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black/10 py-1 z-50">
                  {isAuthenticated ? (
                    <>
                      <Link
                        href="/my-orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Orders
                      </Link>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setUserMenuOpen(false);
                          logout();
                          window.location.href = "/";
                        }}
                      >
                        Sign out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/signin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Sign in
                      </Link>
                      <Link
                        href="/signup"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Sign up
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              className="text-white hover:text-accent p-2"
              onClick={() => setMobileOpen(true)}
              aria-label="Open mobile menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-start pt-5 md:hidden transition-all min-h-screen overflow-y-auto">
          <div className="w-full flex justify-between items-center border-b border-primary/30 z-50 shadow-lg pb-4 px-[24px]">
            <Link
              href="https://forms.gle/Q8sXzoUZ7Sh3KHyR6"
              target="_blank"
              className="bg-[#a5d2b1] text-black px-4 py-1 rounded-sm text-sm font-semibold hover:bg-yellow-600 transition-colors duration-200"
            >
              Apply Now
            </Link>

            <button
              className=" text-white hover:text-accent"
              onClick={() => setMobileOpen(false)}
              aria-label="Close mobile menu"
            >
              <svg
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <Link
            href="/#meet-founders"
            className="text-white text-lg font-light hover:text-accent py-2"
            onClick={() => setMobileOpen(false)}
          >
            Team
          </Link>
          <Link
            href="/#learning-practitioners"
            className="text-white text-lg font-light hover:text-accent py-2"
            onClick={() => setMobileOpen(false)}
          >
            Learning
          </Link>

          <Link
            href="/fellowships"
            className="text-white text-lg font-light hover:text-accent py-2"
            onClick={() => setMobileOpen(false)}
          >
            B&F Fellowship
          </Link>

          <Link
            href="https://forms.gle/Q8sXzoUZ7Sh3KHyR6"
            target="_blank"
            className="text-white text-lg font-light py-2"
          >
            PG Programme{" "}
            <p
              className="text-[#a5d2b1] font-semibold"
              style={{
                fontFamily: '"Chronicle Display Black", serif',
                fontStyle: "italic",
                fontSize: "14px",
              }}
            >
              (Coming Soon)
            </p>
          </Link>

          {/* Auth actions (mobile) */}
          <div className="w-full px-[24px] mt-2">
            <div className="h-px w-full bg-white/10 my-2" />
            {isAuthenticated ? (
              <div className="flex flex-col items-start">
                <Link
                  href="/my-orders"
                  className="text-white text-lg font-light hover:text-accent py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  Orders
                </Link>
                <Link
                  href="/profile"
                  className="text-white text-lg font-light hover:text-accent py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  Profile
                </Link>
                <button
                  className="text-white text-lg font-light hover:text-accent py-2"
                  onClick={() => {
                    setMobileOpen(false);
                    logout();
                    window.location.href = "/";
                  }}
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-start">
                <Link
                  href="/signin"
                  className="text-white text-lg font-light hover:text-accent py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="text-white text-lg font-light hover:text-accent py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
