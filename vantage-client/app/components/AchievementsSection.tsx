"use client";

import React from "react";

export default function AchievementsSection() {
  return (
    <section className="pt-10  bg-black border-b border-gray-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black font-section-heading">
            Student Achievements
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
            Success stories from our exceptional graduates
          </p>
        </div>

        {/* Five Column Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
          {/* Column 1 - Employment */}
          <div className="relative">
            <div className="p-6 text-white">
              <h3 className="text-lg font-semibold mb-4 text-white font-section-heading">
                Employment by leading organizations
              </h3>
              <p className="text-base leading-relaxed text-white">
                Employed by leading organizations like Google, BCG, and the
                World Bank
              </p>
            </div>
            {/* Right border line */}
            <div className="absolute right-0 top-0 bottom-0 w-px bg-white opacity-30"></div>
          </div>

          {/* Column 2 - Graduate School Admissions */}
          <div className="relative">
            <div className="p-6 text-white">
              <h3 className="text-lg font-semibold mb-4 text-white font-section-heading">
                Admission to top graduate schools
              </h3>
              <p className="text-base leading-relaxed text-white">
                Admitted to top grad schools including Oxford, Stanford, and
                Harvard
              </p>
            </div>
            {/* Right border line */}
            <div className="absolute right-0 top-0 bottom-0 w-px bg-white opacity-30"></div>
          </div>

          {/* Column 3 - Prestigious Awards */}
          <div className="relative">
            <div className="p-6 text-white">
              <h3 className="text-lg font-semibold mb-4 text-white font-section-heading">
                Recipients of prestigious fellowships and awards
              </h3>
              <p className="text-base leading-relaxed text-white">
                Recipients of prestigious fellowships and awards, including the
                Rhodes Scholarship, Schwarzman Scholarship, the Diana Award, and
                the Royal Astronomical Society Fellowship.
              </p>
            </div>
            {/* Right border line */}
            <div className="absolute right-0 top-0 bottom-0 w-px bg-white opacity-30"></div>
          </div>

          {/* Column 4 - Startups */}
          <div className="relative">
            <div className="p-6 text-white">
              <h3 className="text-lg font-semibold mb-4 text-white font-section-heading">
                Founding purpose-driven startups
              </h3>
              <p className="text-base leading-relaxed text-white">
                Founding purpose-driven startups in more than 30 countries
              </p>
            </div>
            {/* Right border line */}
            <div className="absolute right-0 top-0 bottom-0 w-px bg-white opacity-30"></div>
          </div>

          {/* Column 5 - Employment Rate */}
          <div className="relative">
            <div className="p-6 text-white">
              <h3 className="text-lg font-semibold mb-4 text-white font-section-heading">
                Graduate employment and further education rate
              </h3>
              <p className="text-base leading-relaxed text-white">
                91% of graduates are employed full-time or in graduate school 6
                months post-graduation
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
