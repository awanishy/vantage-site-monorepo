"use client";

import Image from "next/image";
import { useState } from "react";

export default function LearningSection() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      id: 0,
      title: "Live Mandates",
      content:
        "Apply learning to real challenges from top global institutions, designing solutions with the potential for adoption.",
      image: "/assets/live-mandate.jpg",
    },
    {
      id: 1,
      title: "Industry Internships",
      content:
        "Domestic and international internships at leading institutions, consulting firms, and ventures in high-growth roles",
      image: "/assets/industry-internships.jpg",
    },
    {
      id: 2,
      title: "Launch a Business",
      content:
        "From concept to MVP to revenue, students build real businesses and pitch them to investors.",
      image: "/assets/launch-a-business.jpg",
    },
    {
      id: 3,
      title: "Startup Fund",
      content:
        "Promising student ventures receive up to $200,000 in investment, with mentorship and infrastructure support",
      image: "/assets/startup-fund.jpg",
    },
  ];

  const handleTabClick = (tabId: number) => {
    setActiveTab(tabId);
  };

  return (
    <section
      id="learning-beyond-classroom"
      className="pt-10  bg-white border-b border-gray-200"
    >
      <div className="mx-auto">
        {/* Section Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black font-section-heading">
            Learning{" "}
            <span
              className="italic"
              style={{
                fontFamily: '"Chronicle Display Black", serif',
                color: "#568c65",
              }}
            >
              Beyond
            </span>{" "}
            the Classroom
          </h2>
          {/* <p className="text-base md:text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
            Immersive learning experiences that prepare you for real-world
            challenges
          </p> */}
        </div>

        {/* Full Width Banner with Tabs */}
        <div className="w-full h-[500px] sm:h-[800px] relative overflow-hidden">
          {/* Background Images with Opacity Transitions */}
          {tabs.map((tab, index) => (
            <div key={tab.id} className="absolute inset-0">
              <Image
                src={tab.image}
                alt={tab.title}
                fill
                className={`object-cover transition-all duration-700 ease-in-out ${
                  activeTab === tab.id
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-105"
                }`}
                priority={index === 0}
                sizes="100vw"
                quality={90}
                onError={(e) => {
                  console.error(`Error loading image: ${tab.image}`, e);
                }}
              />
            </div>
          ))}

          {/* Black Gradient Overlay for Text Visibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/65 z-10 transition-opacity duration-700" />

          {/* Content Overlay */}
          <div className="absolute inset-0 z-20">
            {/* Tab Content with Smooth Transitions */}
            <div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center">
              <div
                key={activeTab}
                className="text-xl sm:text-5xl mb-24 sm:mb-0 text-white/90 max-w-4xl leading-relaxed text-center transition-all duration-700 ease-in-out transform px-2"
                style={{
                  animation: "fadeInUp 0.7s ease-out",
                }}
              >
                {tabs[activeTab].content}
              </div>
            </div>

            {/* Tabs */}
            <div className="absolute bottom-0 left-0 right-0 pb-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`pb-2 sm:px-6 sm:py-3 font-semibold transition-all duration-500 ease-in-out text-white border-b-1 sm:border-b-2 ${
                      activeTab === tab.id
                        ? "text-white border-white transform scale-105"
                        : "text-white/60 border-white/30 hover:text-white/80 hover:border-white/50 hover:scale-105"
                    }`}
                  >
                    {tab.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Custom CSS for smooth animations */}
        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </section>
  );
}
