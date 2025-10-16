"use client";

import Link from "next/link";

export default function Admissions() {
  return (
    <section
      id="open-admissions"
      className="pt-10 bg-black border-b border-gray-200"
    >
      {/* Section Header */}
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white font-section-heading">
          Upcoming{" "}
          <span
            className="italic"
            style={{
              fontFamily: '"Chronicle Display Black", serif',
              color: "#568c65",
            }}
          >
            Cohorts
          </span>
        </h2>
      </div>

      {/* Program Cards - Side by Side */}
      <div className="mt-2 mx-auto py-8 pl-4">
        <div className="max-w-7xl mx-auto overflow-x-auto">
          {/* Top White Section with Course Details */}
          <div className="w-xl sm:w-7xl bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
            <div className="flex">
              {/* Global Banking & Finance Fellowship */}
              <div className="h-[28rem] sm:h-48 flex flex-col sm:flex-row flex-1 gap-4 sm:gap-6">
                {/* Image */}
                <div className="w-full h-[35%] sm:h-auto sm:w-1/3 bg-white relative overflow-hidden rounded-lg">
                  {/* fill attribute adds position absolute and that was causing some problem in mobile that's why using normal img tag */}
                  {/* <Image
                    src="/assets/global-banking-finance-fellowship.jpg"
                    alt="Global Banking & Finance Fellowship"
                    quality={100}
                    className="w-full h-full"
                    objectFit="cover"
                    fill
                  /> */}
                  <img
                    src="/assets/global-banking-finance-fellowship.jpg"
                    alt="Global Banking & Finance Fellowship"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col">
                  <h2 className="text-sm sm:text-xl font-bold text-gray-900 mb-2">
                    Global Banking & Finance Fellowship
                  </h2>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <span
                      className="inline-flex items-center px-2 py-1 text-gray-600 text-xs font-normal rounded-full whitespace-nowrap leading-none border border-gray-600"
                      style={{
                        fontFamily: "Sofia Pro Light, sans-serif",
                      }}
                    >
                      Online Live
                    </span>
                    <span
                      className="inline-flex items-center px-2 py-1 text-gray-900 text-xs font-normal rounded-full whitespace-nowrap leading-none bg-gray-100"
                      style={{
                        fontFamily: "Sofia Pro Light, sans-serif",
                      }}
                    >
                      2 Weeks
                    </span>
                  </div>

                  <p className="text-[13px] text-gray-600 mb-4 leading-relaxed">
                    Learn the breadth of global finance, from your first break
                    to closing deals, designed and delivered by MDs and CEOs of
                    Barclays, Lloyds Bank, Centrum Wealth, & a top-tier VC firm.
                  </p>

                  {/* Responsive Starts On Section and Learn More Button */}
                  <div className="mt-auto">
                    {/* Desktop: Side by side with overlap */}
                    <div className="flex flex-col sm:flex-row items-center">
                      <div className="bg-[#D8E3DA] w-full sm:w-auto text-gray-900 px-4 py-1 flex-1 max-w-xs">
                        <span className="text-xs lg:text-sm font-medium whitespace-nowrap">
                          Starts On - 06th Oct 2025
                        </span>
                      </div>
                      <div className="sm:block mt-2 sm:mt-0 flex justify-center bg-gray-900 w-full sm:w-auto text-white px-3 lg:px-4 py-2 sm:-ml-2 relative z-10">
                        <Link
                          href={`/checkout?programId=global-banking-finance-fellowship`}
                          className="inline-flex items-center gap-2 text-xs font-medium"
                        >
                          <span>ENROLL NOW</span>
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-[1px] bg-gray-300 mx-3 sm:mx-5"></div>

              {/* PGP Strategic Finance & Analytics */}
              <div className="h-[28rem] sm:h-48 flex flex-col sm:flex-row flex-1 gap-4 sm:gap-6">
                {/* Image */}
                <div className="w-full h-[35%] sm:h-auto sm:w-1/3 bg-white relative overflow-hidden rounded-lg">
                  {/* fill attribute adds position absolute and that was causing some problem in mobile that's why using normal img tag */}
                  {/* <Image
                    src="/assets/pgp-strategic-finance- analytics.jpg"
                    alt="PGP Strategic Finance & Analytics"
                    // quality={100}
                    className="w-full h-full object-cover"
                    fill
                  /> */}

                  <img
                    src="/assets/pgp-strategic-finance- analytics.jpg"
                    alt="PGP Strategic Finance & Analytics"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col">
                  <h2 className="text-sm sm:text-xl font-bold text-gray-900 mb-2">
                    PGP in Banking & Finance Innovation
                  </h2>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <span
                      className="inline-flex items-center px-2 py-1 text-gray-600 text-xs font-normal rounded-full whitespace-nowrap leading-none border border-gray-600"
                      style={{
                        fontFamily: "Sofia Pro Light, sans-serif",
                      }}
                    >
                      On Campus
                    </span>
                    <span
                      className="inline-flex items-center px-2 py-1 text-gray-900 text-xs font-normal rounded-full whitespace-nowrap leading-none bg-gray-100"
                      style={{
                        fontFamily: "Sofia Pro Light, sans-serif",
                      }}
                    >
                      15 Months
                    </span>
                  </div>

                  <p className="text-[13px] text-gray-600 mb-4 leading-relaxed">
                    Master modern banking and finance with a programme led by
                    MDs, CEOs, and ivy B-school academics, built on the rigor of
                    Wall Street and Canary Wharf.
                  </p>

                  {/* Responsive Starts On Section and Learn More Button */}
                  <div className="mt-auto">
                    {/* Desktop: Side by side with overlap */}
                    <div className="flex flex-col sm:flex-row items-center">
                      <div className="bg-[#D8E3DA] w-full sm:w-auto text-gray-900 px-4 py-1 flex-1 max-w-xs">
                        <span className="text-xs lg:text-sm font-medium whitespace-nowrap">
                          Starts On - April 2026
                        </span>
                      </div>
                      <div className="sm:block mt-2 sm:mt-0 flex justify-center bg-gray-900 text-white w-full sm:w-auto px-3 lg:px-4 py-2 sm:-ml-2 relative z-10">
                        <Link
                          href="https://forms.gle/Q8sXzoUZ7Sh3KHyR6"
                          target="_blank"
                          className="inline-flex items-center gap-2 text-xs font-medium"
                        >
                          <span>SHOW INTEREST</span>
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* {cohorts.map((cohort, index) => (
                  <div className="h-[26rem] sm:h-48 flex flex-col sm:flex-row flex-1 gap-4 sm:gap-6">
                    <div className="w-full sm:w-1/3 bg-white relative overflow-hidden rounded-lg">
                      <img
                        src={cohort.image}
                        alt={cohort.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col">
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                        {cohort.title}
                      </h2>

                      <div className="flex flex-wrap gap-2 mb-3">
                        <span
                          className="inline-flex items-center px-2 py-1 text-gray-600 text-xs font-normal rounded-full whitespace-nowrap leading-none border border-gray-600"
                          style={{
                            fontFamily: "Sofia Pro Light, sans-serif",
                          }}
                        >
                          {cohort.mode}
                        </span>
                        <span
                          className="inline-flex items-center px-2 py-1 text-gray-900 text-xs font-normal rounded-full whitespace-nowrap leading-none bg-gray-100"
                          style={{
                            fontFamily: "Sofia Pro Light, sans-serif",
                          }}
                        >
                          {cohort.duration}
                        </span>
                      </div>

                      <p className="text-[13px] text-gray-600 mb-4 leading-relaxed">
                        {cohort.description}
                      </p>

                      <div className="mt-auto">
                        <div className="flex flex-col sm:flex-row items-center">
                          <div className="bg-[#D8E3DA] w-full sm:w-auto text-gray-900 px-4 py-1 flex-1 max-w-xs">
                            <span className="text-xs lg:text-sm font-medium whitespace-nowrap">
                              {`Starts On - ${cohort.startDate}`}
                            </span>
                          </div>
                          <div className="sm:block mt-2 sm:mt-0 flex justify-center bg-gray-900 text-white w-full sm:w-auto px-3 lg:px-4 py-1 sm:-ml-2 relative z-10">
                            <button className="inline-flex items-center gap-2 text-xs font-medium">
                              <span>{cohort.buttonText}</span>
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))} */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
