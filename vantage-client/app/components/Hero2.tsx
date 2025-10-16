"use client";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-[20vh] flex flex-col items-center justify-center bg-black text-center pt-24 sm:pt-32 overflow-hidden pb-8"
    >
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <h1
          className="font-light w-full text-8xl sm:text-[155px] text-white"
          style={{
            fontFamily: "Sofia Pro, sans-serif",
            letterSpacing: "-0.03em",
            lineHeight: "1.05", // Tighter line spacing
          }}
        >
          The
          <span
            className="italic font-normal text-[#a5d2b1]"
            style={{
              fontFamily: "Instrument Serif, serif",
              letterSpacing: "-0.03em",
            }}
          >
            {" "}
            Finance School
          </span>{" "}
        </h1>

        {/* Description */}
        <p className="text-base mt-3 sm:mt-0 md:text-lg lg:text-[35px] text-white mb-10 font-light max-w-4xl mx-auto">
          Taught by the leaders who shaped trillion-dollar finance
        </p>

        {/* Program Offerings */}
        <div className="mb-8 hidden sm:block">
          <p
            className="text-center text-base md:text-xl font-light text-green-400"
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
        <div className="sm:hidden">
          <button className="bg-[#a5d2b1] text-black px-6 py-2 rounded-md text-sm font-semibold hover:bg-yellow-600 transition-colors duration-200">
            Apply Now
          </button>
        </div>

        {/* Image Grid - 3 Different Sizes with Equal Mouse Tracking */}
        {/* <div
          ref={gridRef}
          className="hidden sm:flex justify-center   pb-10 mt-16 cursor-none"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={handleMouseEnter}
        >
          <div className="flex gap-6 items-center">
            <div
              className="w-56 h-40 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 cursor-pointer group"
              style={{ transform: getTransformValue(0) }}
            >
              <Image
                src="/assets/homepage-hero-images/hero-image-1.jpg"
                alt="Finance Program 1"
                width={224}
                height={160}
                className="w-full h-full object-cover transition-transform duration-300"
                priority
                quality={90}
              />
            </div>

            <div
              className="w-64 h-64 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 cursor-pointer group"
              style={{ transform: getTransformValue(1) }}
            >
              <Image
                src="/assets/homepage-hero-images/hero-image-2.jpg"
                alt="Finance Program 2"
                width={256}
                height={256}
                className="w-full h-full object-cover transition-transform duration-300"
                quality={90}
              />
            </div>

            <div
              className="w-56 h-40 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 cursor-pointer group"
              style={{ transform: getTransformValue(2) }}
            >
              <Image
                src="/assets/homepage-hero-images/hero-image-3.jpg"
                alt="Finance Program 3"
                width={224}
                height={160}
                className="w-full h-full object-cover transition-transform duration-300"
                quality={90}
              />
            </div>

            <div
              className="w-80 h-72 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 cursor-pointer group"
              style={{ transform: getTransformValue(3) }}
            >
              <Image
                src="/assets/homepage-hero-images/hero-image-4.jpg"
                alt="Finance Program 4 - Center"
                width={320}
                height={288}
                className="w-full h-full object-cover transition-transform duration-300"
                quality={90}
              />
            </div>

            <div
              className="w-56 h-40 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 cursor-pointer group"
              style={{ transform: getTransformValue(4) }}
            >
              <Image
                src="/assets/homepage-hero-images/hero-image-5.jpg"
                alt="Finance Program 5"
                width={224}
                height={160}
                className="w-full h-full object-cover transition-transform duration-300"
                quality={90}
              />
            </div>

            <div
              className="w-64 h-64 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 cursor-pointer group"
              style={{ transform: getTransformValue(5) }}
            >
              <Image
                src="/assets/homepage-hero-images/hero-image-6.jpg"
                alt="Finance Program 6"
                width={256}
                height={256}
                className="w-full h-full object-cover transition-transform duration-300"
                quality={90}
              />
            </div>

            <div
              className="w-56 h-40 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 cursor-pointer group"
              style={{ transform: getTransformValue(6) }}
            >
              <Image
                src="/assets/homepage-hero-images/hero-image-7.jpg"
                alt="Finance Program 7"
                width={224}
                height={160}
                className="w-full h-full object-cover transition-transform duration-300"
                quality={90}
              />
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
}
