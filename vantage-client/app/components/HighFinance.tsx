"use client";

import { Fragment } from "react";

export default function HighFinance() {
  const highFinanceCards = [
    {
      title: "Step into the most competitive roles in global finance",
      description:
        "Break into investment banking, venture capital, wealth management, and leadership tracks at the world’s top institutions. These are the roles that define careers — fast-tracked, high-responsibility, and designed to put you at the center of global markets.",
    },
    {
      title: "Learn directly from the boardrooms of global finance",
      description:
        "Your classes are led by MDs, CEOs, and senior practitioners who have steered Barclays, Lloyds, Goldman Sachs, and leading VC firms. They don’t just teach you finance — they bring the strategies and decisions that have moved markets.",
    },
    {
      title: "Earn the world’s most recognized finance credentials",
      description:
        "Every course is mapped to certifications like CFA, FRM, and Fintech credentials, ensuring your learning carries global credibility. These aren’t just add-ons — they’re the same benchmarks top recruiters look for when hiring future leaders.",
    },
    {
      title: "Stay ahead of the curve with frontier topics",
      description:
        "Go beyond traditional finance and master areas reshaping the industry: AI in finance, digital assets, ESG investing, and global regulatory shifts. These are the conversations shaping boardrooms today — and the opportunities you’ll be prepared to lead tomorrow.",
    },
  ];

  return (
    <section
      id="meet-founders"
      className="pt-10 border-b border-gray-200"
      // className="pt-10 bg-black border-b border-gray-200"
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black font-section-heading">
            Born of Wall Street and Canary Wharf, rooted in Dalal Street,{" "}
            <span
              className="italic"
              style={{
                fontFamily: '"Chronicle Display Black", serif',
                color: "#568c65",
              }}
            >
              India&apos;s First Global Finance Institute
            </span>{" "}
            Institute
          </h2>
        </div>
      </div>

      {/* Full-width strip for cards (mirrors ProjectsSection layout) */}
      <div
        className="w-full border-t border-gray-200 mt-8 overflow-x-auto"
        // style={{ backgroundColor: "#000000" }}
      >
        <div className="w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-4">
            {highFinanceCards.map((card, index) => (
              <Fragment key={index}>
                <div className="relative">
                  <div className="p-6 text-black h-full">
                    <h3 className="text-xl md:text-lg font-bold mb-3 font-section-heading w-full">
                      <span
                        className="text-[#568C65] italic"
                        // style={{
                        //   fontFamily: '"Chronicle Display Black", serif',
                        // }}
                      >
                        {card.title}
                      </span>
                    </h3>
                    <p className="text-sm leading-relaxed text-black">
                      {card.description}
                    </p>
                  </div>

                  {/* Right divider for desktop */}
                  {index < highFinanceCards.length - 1 && (
                    <div className="absolute right-0 top-0 bottom-0 w-px bg-gray-200" />
                  )}
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
