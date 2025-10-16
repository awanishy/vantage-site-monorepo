import React from "react";

const CourseInfoComponent = () => {
  const statsData = [
    {
      number: "06th October 2025",
      label: "Starts On",
    },
    {
      number: "02 Weeks",
      label: "Duration",
    },
    {
      number: "Final-year students, postgraduates, & young professionals",
      label: "Eligibility",
    },
    {
      number: "14,999",
      label: "Price",
    }
  ];

  return (
    <section className="bg-white">
      <div className="mx-auto lg:max-w-7xl px-2 lg:px-16">
        {/* Statistics Section */}
        <div className="py-4 lg:py-8">
          {/* Mobile: Horizontal scroll container */}
          <div className="lg:hidden overflow-x-auto">
            <div className="flex min-w-max gap-4 pb-2">
              {statsData.map((stat, index) => (
                <div key={index} className="flex-shrink-0 px-4 py-2 bg-gray-50 rounded-lg whitespace-nowrap">
                  {/* Heading/Label on top */}
                  <p
                    className="text-gray-600 font-semibold text-sm italic mb-2"
                    style={{
                      fontFamily: "Instrument Serif, serif",
                    }}
                  >
                    {stat.label}
                  </p>
                  {/* Value below */}
                  <h2 className="font-normal text-gray-800 text-xs">
                    <span>{stat.number}</span>
                  </h2>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: Original layout */}
          <div className="hidden lg:flex flex-row text-left">
            {statsData.map((stat, index) => (
              <div key={index} className="relative px-10">
                {/* Heading/Label on top */}
                <p
                  className="text-gray-600 font-semibold text-2xl italic"
                  style={{
                    fontFamily: "Instrument Serif, serif",
                  }}
                >
                  {stat.label}
                </p>
                {/* Value below - Added consistent mt-2 for uniform gap */}
                <h2 className="mt-4 font-normal text-gray-800 text-lg">
                  <span>{stat.number}</span>
                </h2>
                {/* Divider line */}
                {index < statsData.length - 1 && (
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 h-28 w-px bg-gray-200"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseInfoComponent;