"use client";
import React, { useState } from "react";

const AboutProgramme = () => {
  const [activeHighlight, setActiveHighlight] = useState<number | null>(null);

  const highlights = [
    {
      title: "Venture Capital & Startups",
      description:
        "Scaling breakthrough companies through proven investment playbooks.",
      icon: "🚀",
      color: "from-gray-600 to-gray-700",
      bgColor: "bg-gray-50",
    },
    {
      title: "Fintech & Innovation",
      description:
        "Unpacking digital banking, payments, and technology-driven disruption in finance.",
      icon: "💳",
      color: "from-gray-600 to-gray-700",
      bgColor: "bg-gray-50",
    },
    {
      title: "Global Banking & Wealth",
      description:
        "Mastering private banking, lending, markets, and investment banking fundamentals.",
      icon: "🏦",
      color: "from-gray-600 to-gray-700",
      bgColor: "bg-gray-50",
    },
    {
      title: "Future of Finance",
      description:
        "ESG mandates, climate-first capital, and sustainable finance strategies.",
      icon: "🌱",
      color: "from-gray-600 to-gray-700",
      bgColor: "bg-gray-50",
    },
    {
      title: "Career Acceleration",
      description:
        "CV crafting, LinkedIn optimisation, and mock interviews with global recruiters.",
      icon: "⚡",
      color: "from-gray-600 to-gray-700",
      bgColor: "bg-gray-50",
    },
  ];

  return (
    <div className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 font-section-heading">
            About the <span className="text-[#083254]">Programme</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
            Comprehensive curriculum designed for finance professionals
          </p>
        </div>

        {/* Main Description with Creative Layout */}
        <div className="relative mb-20">
          <div className="absolute inset-0 bg-gray-100 rounded-3xl transform rotate-1"></div>
          <div className="relative bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-200">
            <div className="absolute top-6 left-6 w-16 h-16 bg-[#083254] rounded-full flex items-center justify-center text-white text-2xl font-bold">
              ∞
            </div>
            <div className="ml-0 md:ml-24">
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-light">
                Designed and delivered by{" "}
                <span className="font-bold text-[#083254]">
                  global finance CXOs
                </span>
                , The Global Fellowship In High Finance is India&apos;s most
                selective program in modern finance. Over two weeks, you move
                beyond theory into the{" "}
                <span className="relative">
                  <span className="bg-gray-200 px-2 py-1 rounded-md">
                    boardrooms of CXOs
                  </span>
                </span>
                , learning how fintech, venture capital, wealth & private
                banking, credit, and risk operate at the highest level.
              </p>
            </div>
          </div>
        </div>

        {/* Learning Highlights Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-section-heading">
              Learning <span className="text-[#083254]">Highlights</span>
            </h3>
            <div className="w-24 h-1 bg-[#083254] rounded-full mx-auto"></div>
          </div>

          {/* Interactive Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {highlights.map((highlight, index) => (
              <div
                key={index}
                className={`relative group cursor-pointer transition-all duration-500 hover:scale-105 ${
                  activeHighlight === index ? "scale-105" : ""
                }`}
                onMouseEnter={() => setActiveHighlight(index)}
                onMouseLeave={() => setActiveHighlight(null)}
              >
                {/* Background Card */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${highlight.color} rounded-2xl transform rotate-2 group-hover:rotate-3 transition-transform duration-300`}
                ></div>

                {/* Main Card */}
                <div
                  className={`relative ${highlight.bgColor} rounded-2xl p-8 border border-gray-200 shadow-lg group-hover:shadow-2xl transition-all duration-300`}
                >
                  {/* Icon */}
                  <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {highlight.icon}
                  </div>

                  {/* Title */}
                  <h4 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#083254] transition-colors font-section-heading">
                    {highlight.title}
                  </h4>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed text-sm group-hover:text-gray-700 transition-colors">
                    {highlight.description}
                  </p>

                  {/* Animated Border */}
                  <div
                    className={`absolute bottom-0 left-0 h-1 bg-[#083254] rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left w-full`}
                  ></div>
                </div>

                {/* Floating Number Badge */}
                <div
                  className={`absolute -top-3 -right-3 w-8 h-8 bg-[#083254] text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg`}
                >
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutProgramme;
