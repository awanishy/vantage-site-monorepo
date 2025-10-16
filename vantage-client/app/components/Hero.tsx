"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative h-[88vh]  sm:min-h-[85vh] flex flex-col items-center justify-center text-left pt-24 sm:pt-32 overflow-hidden pb-8"
    >
      {/* Video Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="assets/hero-vid.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Black Gradient Overlay: left (dark) to right (transparent) */}
        <div className="absolute inset-0 pointer-events-none">
          {/* <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 via-50% to-transparent to-90%" /> */}
          <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/95 via-black/80 via-50% to-transparent to-90%" />

          {/* ALTERNATIVE MOBILE GRADIENT FROM TOP TO BOTTOM */}
          {/* <div className="absolute inset-0 bg-gradient-to-b sm:bg-gradient-to-r from-black/95 via-black/80 to-transparent" /> */}
        </div>
      </div>
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-left mb-10">
        <h1
          className="font-light w-full text-8xl sm:text-[140px] text-white text-left leading-tight"
          style={{
            fontFamily: "Sofia Pro, sans-serif",
            letterSpacing: "-0.03em",
            lineHeight: "1.05",
          }}
        >
          The{" "}
          <span
            className="italic font-normal text-[#a5d2b1]"
            style={{
              fontFamily: "Instrument Serif, serif",
              letterSpacing: "-0.03em",
            }}
          >
            Finance{" "}
          </span>
          <span
            className="italic font-normal text-[#a5d2b1]"
            style={{
              fontFamily: "Instrument Serif, serif",
              letterSpacing: "-0.03em",
            }}
          >
            School
          </span>
        </h1>

        {/* Description */}
        <p className="text-base mt-3 sm:mt-0 md:text-lg lg:text-[35px] text-white mb-10 font-light max-w-4xl mx-auto sm:mx-0 text-left">
          Taught by the leaders who shaped trillion-dollar finance
        </p>

        {/* Program Offerings */}
        <div className="mb-8 hidden sm:block text-left">
          <p
            className="text-base md:text-xl font-light text-green-400 text-left"
            style={{
              color: "#ffffff",
            }}
          >
            <span className="text-white">IB </span>
            <span className="text-white" aria-hidden="true">
              |
            </span>
            <span className="text-white"> PE & VC </span>

            <span className="text-white" aria-hidden="true">
              |
            </span>
            <span className="text-white"> Capital Markets </span>
            <span className="text-white" aria-hidden="true">
              |
            </span>
            <span className="text-white">
              {" "}
              Wealth, Asset & Risk Management{" "}
            </span>
            <span className="text-white" aria-hidden="true">
              |
            </span>
            <span className="text-white"> Fintech</span>
          </p>
        </div>

        {/* Only visible in mobile */}
        <div className="sm:hidden text-center">
          <Link
            href="https://forms.gle/Q8sXzoUZ7Sh3KHyR6"
            target="_blank"
            className="bg-[#a5d2b1] text-black px-6 py-2 rounded-md text-sm font-semibold hover:bg-yellow-600 transition-colors duration-200"
          >
            Apply Now
          </Link>
        </div>

        {/* Animated Badge Text */}
        {/*
        <div className="mt-32 min-h-[60px] h-[60px] relative overflow-hidden flex justify-center items-center">
          {badges.map((label, idx) => (
            <span
              key={label}
              className={`absolute left-1/2 top-1/2 w-full text-center text-2xl sm:text-4xl font-normal transition-opacity duration-700 ease-in-out
                ${idx === currentBadge ? "opacity-80" : "opacity-0"}
              `}
              style={{
                transform: "translate(-50%, -50%)",
                fontFamily: "'Montserrat', Arial, sans-serif",
                color: "#fff",
                textShadow: "0 2px 8px rgba(0,0,0,0.5)",
                transitionProperty: "opacity",
              }}
            >
              {label}
            </span>
          ))}
        </div>
        */}

        {/* Image Grid - commented out */}
      </div>
    </section>
  );
}
