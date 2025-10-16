"use client";

const BuiltFor = () => {
  const cards = [
    {
      title: "Undergraduate and Recent Graduates",
      description:
        "Ambitious students looking to understand how global finance operates, gain exposure to industry leaders, and make informed choices about which finance vertical to pursue.",
    },
    {
      title: "Postgraduate Students",
      description:
        "Advanced learners ready to transform academic expertise into real-world perspective through direct engagement with CXOs from leading financial institutions.",
    },
    {
      title: "Young Professionals",
      description:
        "Early-career talent eager to move beyond entry-level work, broaden their strategic outlook, and accelerate into high-impact roles by learning directly from industry executives.",
    },
  ];

  return (
    <section className="bg-white border-b border-gray-600">
      <div className="w-full mx-auto px-4 lg:px-50">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black font-section-heading">
            <span
              className="italic"
              style={{
                fontFamily: '"Chronicle Display Black", serif',
                color: "#568c65",
              }}
            >
              Who
            </span>{" "}
            Should Apply
          </h2>
        </div>

        <div className="py-10">
          {/* Mobile: Optimized scroll with single container */}
          <div className="lg:hidden">
            <div className="flex gap-4 overflow-x-auto scrollbar-hide px-4 pb-4">
              {cards.map((card, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-72 bg-black rounded-2xl"
                >
                  <div className="h-60 p-6 group hover:bg-white transition-all duration-1000">
                    <h3 className="text-sm font-bold mb-3 font-section-heading">
                      <span className="text-black tracking-tighter bg-white rounded-sm px-2 py-1 group-hover:bg-black group-hover:text-white transition-all duration-1000">
                        {card.title}
                      </span>
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed group-hover:text-black transition-all duration-300">
                      {card.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: Simplified layout */}
          <div className="hidden lg:flex gap-8 max-w-7xl mx-auto">
            {cards.map((card, index) => (
              <div key={index} className="flex-1 bg-black rounded-2xl">
                <div className="h-64 p-6 group hover:bg-white transition-all duration-1000">
                  <h3 className="text-lg font-bold mb-3 font-section-heading">
                    <span className="text-black bg-white rounded-sm px-2 py-1 group-hover:bg-black group-hover:text-white transition-all duration-1000">
                      {card.title}
                    </span>
                  </h3>
                  <p className="text-gray-300 text-lg leading-relaxed group-hover:text-black transition-all duration-300">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default BuiltFor;
