"use client";

import React from "react";

export default function ScholarshipsSection() {
  return (
    <section className="pt-10  bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content */}
        <div className="space-y-5">
          {/* Top Section - 1 in 5 Statistic in Full Width Black Background */}
          <div className="w-full">
            <div className="bg-black px-6 sm:px-16 py-5 sm:py-12 w-full h-72 sm:h-[450px] relative">
              <div className="text-left">
                <div className="text-xl md:text-5xl text-white leading-tight max-w-3xl">
                  1 in every 5 seats is reserved as a full scholarship, awarded
                  only to the most outstanding candidates
                </div>
              </div>

              {/* Bottom Heading */}
              <div className="absolute bottom-4 sm:bottom-8 sm:left-16">
                <div className="text-2xl md:text-4xl text-white leading-tight max-w-3xl">
                  <span
                    className="italic"
                    style={{
                      fontFamily: '"Chronicle Display Black", serif',
                      color: "#A5D2B0",
                    }}
                  >
                    Scholarships
                  </span>{" "}
                  <span
                    style={{
                      fontFamily: '"Sofia Pro Light", sans-serif',
                    }}
                  >
                    & Social Responsibility
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full width background div for scholarship cards */}
      <div
        className="w-full border-t border-gray-300 overflow-x-auto"
        style={{ backgroundColor: "#F7F7F7" }}
      >
        <div className="w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Bottom Section - Four Scholarship Types */}
          <div className="grid grid-cols-4 gap-0">
            {/* Academic Merit Scholarships */}
            <div className="relative">
              <div className="p-6 text-black">
                <h3 className="text-lg font-semibold mb-4 text-black font-section-heading">
                  Academic Merit Scholarships
                </h3>
                <p className="text-base leading-relaxed text-black">
                  Awarded to students with outstanding academic records
                </p>
              </div>
              {/* Right border line */}
              <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-px bg-gray-300 opacity-50"></div>
              {/* Bottom line for mobile */}
              {/* <div className="block sm:hidden w-full h-px bg-gray-400 opacity-50"></div> */}
            </div>

            {/* Need-Based Access Scholarships */}
            <div className="relative">
              <div className="p-6 text-black">
                <h3 className="text-lg font-semibold mb-4 text-black font-section-heading">
                  Need-Based Access Scholarships
                </h3>
                <p className="text-base leading-relaxed text-black">
                  Need-conscious support ensures that financial constraints
                  don&apos;t limit admission
                </p>
              </div>
              {/* Right border line */}
              <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-px bg-gray-300 opacity-50"></div>
              {/* Bottom line for mobile */}
              {/* <div className="block sm:hidden w-full h-px bg-gray-400 opacity-50"></div> */}
            </div>

            {/* Achievement Scholarships */}
            <div className="relative">
              <div className="p-6 text-black">
                <h3 className="text-lg font-semibold mb-4 text-black font-section-heading">
                  Achievement Scholarships
                </h3>
                <p className="text-base leading-relaxed text-black">
                  Presented to professionals demonstrating exceptional impact in
                  their field
                </p>
              </div>
              {/* Right border line */}
              <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-px bg-gray-300 opacity-50"></div>
              {/* Bottom line for mobile */}
              {/* <div className="block sm:hidden w-full h-px bg-gray-400 opacity-50"></div> */}
            </div>

            {/* Women in Leadership */}
            <div className="relative">
              <div className="p-6 text-black">
                <h3 className="text-lg font-semibold mb-4 text-black font-section-heading">
                  Women in Leadership
                </h3>
                <p className="text-base leading-relaxed text-black">
                  Targeted scholarships to foster gender diversity and support
                  women poised to lead in business
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
