"use client";
import React, { useState } from "react";
import Image from "next/image";

interface ScheduleItem {
  day: string;
  title: string;
  person: string;
  description: string;
  designation: string;
}

const ThreeStep = () => {
  const [activeTab, setActiveTab] = useState(0);

  const weekTabs = [
    {
      title: "Week 1",
      subtitle: "Industry Foundations",
      description:
        "Unpacking Modern Banking: Boardroom Perspectives on Credit, Deals, and Risk",
      schedule: [
        {
          day: "Monday",
          title: "Banking Unboxed",
          person: "Syed Raza",
          description: "Modern banking models and how banks make money",
          designation: "Ex MD & CEO, Barclays",
        },
        {
          day: "Tuesday",
          title: "Credit In Action",
          person: "Rakesh Kripalini",
          description: "Lending and credit decision-making in practice",
          designation: "Director, Barclays",
        },
        {
          day: "Wednesday",
          title: "Green Capital",
          person: "Satya Bansal",
          description: "ESG & Climate-aligned investing",
          designation: "Founder & CEO, Blue Ashwa Capital",
        },
        {
          day: "Thursday",
          title: "Advising the Accomplished",
          person: "Sandeep Das",
          description: "Private banking and wealth management",
          designation: "MD & CEO, Centrum Wealth",
        },
        {
          day: "Friday",
          title: "Fire Side Chat",
          person: "Syed Raza",
          description:
            "Listen to the stories of leaders sharing their career journeys in banking & finance",
          designation: "Ex MD & CEO, Barclays",
        },
      ],
    },
    {
      title: "Week 2",
      subtitle: "Growth Areas & Career Execution",
      description:
        "Finance Rewired: From digital disruption to green investing and private banking mastery",
      schedule: [
        {
          day: "Monday",
          title: "Finance Rewired",
          person: "Syed Raza",
          description: "Fintech, AI, and digital banking trends",
          designation: "Ex MD & CEO, Barclays",
        },
        {
          day: "Tuesday",
          title: "Client Management Art",
          person: "Lisa Francis",
          description: "Relationship management in finance",
          designation: "MD, Lloyds Bank",
        },
        {
          day: "Wednesday",
          title: "Guardrails Of Finance",
          person: "Guest CRO",
          description: "Risk frameworks and regulatory compliance",
          designation: "",
        },
        {
          day: "Thursday",
          title: "Ready to Launch",
          person: "Adam Ergin",
          description: "CV, LinkedIn, and interview masterclass",
          designation: "Recruiter, Investment Banking",
        },
        {
          day: "Friday",
          title: "Pitch & Propel",
          person: "Close by Syed Raza",
          description:
            "Capstone briefing & career opportunities in high finance",
          designation: "Ex MD & CEO Barclays",
        },
      ],
    },
  ];

  const sections = [
    {
      id: "why-augment-2",
      title: "Join a select global network of finance enthusiasts. ",
      description:
        "Build lasting connections, collaborate across borders, and grow through exclusive events and learning sessions hosted year-round.",
      buttonText: "Explore Courses",
      buttonLink: "/augment-mba-program",
      image: "/assets/community.jpg",
    },
  ];

  // Function to group schedule items for desktop
  const getGroupedSchedule = (schedule: ScheduleItem[]) => {
    return [
      [schedule[0], schedule[1]], // Monday & Tuesday
      [schedule[2]], // Wednesday
      [schedule[3], schedule[4]], // Thursday & Friday
    ];
  };

  return (
    <section className="bg-black">
      <div className="px-4 pt-10 lg:pt-[50px] mx-auto max-w-[1272px]">
        {/* Header Section */}
        <div className="mb-8 text-center ">
          <h2 className="text-3xl md:text-4xl font-bold text-white font-section-heading">
            Inside the Fellowship: A{" "}
            <span
              className="italic"
              style={{
                fontFamily: '"Chronicle Display Black", serif',
                color: "#a5d2b0",
              }}
            >
              Day-to-Day
            </span>{" "}
            Experience
          </h2>
        </div>

        {/* ================= CURRICULUM SECTION (Sticky limited to here) ================= */}
        <div className="mb-16">
          {/* Tabs (Sticky only inside this block) */}
          <div className="sticky top-[64px] z-40 lg:hidden flex gap-4 mb-8 justify-center lg:justify-start bg-black py-2">
            {weekTabs.map((tab, idx) => (
              <button
                key={tab.title}
                onClick={() => setActiveTab(idx)}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === idx
                    ? "bg-[#A5D2B0] text-black"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {tab.title}
              </button>
            ))}
          </div>

          {/* Mobile Single Card Layout */}
          <div className="lg:hidden mb-12">
            <div className="text-white mb-6 text-center">
              <div className="text-sm uppercase tracking-wider opacity-70 mb-2">
                Curriculum
              </div>
              <h3 className="text-2xl font-bold mb-3">
                {weekTabs[activeTab].subtitle}
              </h3>
              <p className="text-base">{weekTabs[activeTab].description}</p>
            </div>

            <div className="bg-white rounded-2xl p-4">
              <div className="space-y-4">
                {weekTabs[activeTab].schedule.map((item, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="w-20 h-28 bg-[#d0f2d8] rounded-lg flex flex-col items-center justify-center text-black p-2 flex-shrink-0">
                      <div className="text-center">
                        <h4 className="font-bold text-xs leading-tight">
                          {item.person}
                        </h4>
                        <span className="font-medium text-xs text-gray-600 mt-1 block">
                          {item.designation}
                        </span>
                      </div>
                    </div>
                    <div
                      className="flex-grow flex flex-col justify-center rounded-lg bg-cover bg-center relative min-h-[96px]"
                      style={{
                        backgroundImage: "url('/assets/classroom.jpg')",
                      }}
                    >
                      <div className="absolute inset-0 bg-black/50 rounded-lg"></div>
                      <div className="relative z-10 text-white p-3">
                        <span className="font-medium text-xs uppercase text-[#A5D2B0]">
                          {item.day}
                        </span>
                        <h4 className="font-bold text-xs leading-tight mb-1">
                          {item.title}
                        </h4>
                        <p className="text-xs leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:flex lg:flex-row lg:items-stretch gap-6 lg:gap-20 mb-12 rounded-2xl">
            <div className="flex flex-col gap-8 w-full lg:w-[35%] lg:px-8 lg:py-10 justify-center">
              <div className="flex gap-4 mb-8 justify-center lg:justify-start">
                {weekTabs.map((tab, idx) => (
                  <button
                    key={tab.title}
                    onClick={() => setActiveTab(idx)}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === idx
                        ? "bg-[#A5D2B0] text-black"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {tab.title}
                  </button>
                ))}
              </div>
              <div className="text-white">
                <div className="text-sm uppercase tracking-wider opacity-70 mb-2">
                  Curriculum
                </div>
                <h3 className="text-[1.625rem] lg:text-2xl font-bold mb-3">
                  {weekTabs[activeTab].subtitle}
                </h3>
                <p className="text-lg">{weekTabs[activeTab].description}</p>
              </div>
            </div>
            <div className="w-full p-6 rounded-2xl">
              <div className="space-y-4 bg-white p-4 rounded-2xl">
                {getGroupedSchedule(weekTabs[activeTab].schedule).map(
                  (group, groupIdx) => (
                    <div key={groupIdx} className="space-y-4">
                      {group.length === 1 ? (
                        <div className="flex gap-4">
                          <div className="w-32 h-40 bg-[#d0f2d8] rounded-lg flex flex-col items-center justify-center text-black p-2 flex-shrink-0">
                            <div className="font-bold text-md text-center leading-tight">
                              <h4 className="font-bold leading-tight">
                                {group[0].person}
                              </h4>
                              <span className="font-medium text-xs text-gray-600">
                                {group[0].designation}
                              </span>
                            </div>
                          </div>
                          <div
                            className="flex-grow flex flex-col justify-center bg-[#f5f5f5] rounded-lg bg-cover bg-center relative"
                            style={{
                              backgroundImage: "url('/assets/classroom.jpg')",
                            }}
                          >
                            <div className="absolute inset-0 bg-black/50 rounded-lg"></div>
                            <div className="text-md z-10 text-white leading-relaxed p-4">
                              <span className="font-medium text-xs uppercase">
                                {group[0].day}
                              </span>
                              <h4 className="font-bold leading-tight">
                                {group[0].title}
                              </h4>
                              <div className="text-sm">
                                {group[0].description}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {group.map((item, idx) => (
                            <div key={idx} className="flex gap-2">
                              <div className="w-32 h-32 bg-[#d0f2d8] rounded-lg flex flex-col items-center justify-center text-black p-2 flex-shrink-0">
                                <div className="font-bold text-md text-center leading-tight">
                                  <h4 className="font-bold leading-tight mt-1">
                                    {item.person}
                                  </h4>
                                  <span className="font-medium text-xs text-gray-600">
                                    {item.designation}
                                  </span>
                                </div>
                              </div>
                              <div
                                className="flex-grow flex flex-col justify-center rounded-lg bg-cover bg-center relative"
                                style={{
                                  backgroundImage:
                                    "url('/assets/classroom.jpg')",
                                }}
                              >
                                <div className="absolute inset-0 bg-black/50 rounded-lg"></div>
                                <div className="relative z-10 text-white leading-relaxed p-3">
                                  <span className="font-medium text-xs text-white uppercase">
                                    {item.day}
                                  </span>
                                  <h4 className="font-bold text-md leading-tight mb-1">
                                    {item.title}
                                  </h4>
                                  <p className="text-sm">{item.description}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
        {/* ================= END CURRICULUM SECTION ================= */}

        {/* ================= COMMUNITY SECTION ================= */}
        <div>
          {sections.map((section, index) => (
            <div
              key={section.id}
              id={section.id}
              className={`flex flex-col lg:flex-row ${
                index % 2 === 0 ? "lg:flex-row-reverse" : ""
              } lg:items-stretch gap-6 lg:gap-20 items-center rounded-2xl mb-12`}
            >
              {/* Content Section */}
              <div className="flex flex-col gap-8 w-full lg:w-[35%] lg:px-8 lg:py-10 justify-center lg:h-[400px]">
                <div className="lg:flex lg:flex-col lg:justify-center lg:flex-1">
                  <div className="text-sm uppercase tracking-wider opacity-70 mb-2 text-white">
                    Vantage Community
                  </div>
                  <h3 className="text-2xl lg:text-2xl font-bold mb-3 text-white">
                    {section.title}
                  </h3>
                  <div className="text-lg text-white">
                    <p>{section.description}</p>
                  </div>
                </div>
              </div>
              {/* Image Section */}
              <div className="w-full p-6 rounded-2xl">
                <div className="bg-white p-4 rounded-2xl h-[300px] lg:h-[400px] w-full">
                  <div className="h-full w-full overflow-hidden">
                    <figure className="relative h-full w-full">
                      <Image
                        alt="Entrepreneurship illustration"
                        src={section.image}
                        fill
                        className="object-cover object-top rounded-2xl"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </figure>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* ================= END COMMUNITY SECTION ================= */}
      </div>
    </section>
  );
};

export default ThreeStep;
