import Link from "next/link";

const HeroSection = () => {
  return (
    <div className="pt-24 lg:pt-64 lg:px-32 bg-black flex flex-col items-center justify-center">
      <div className="flex flex-col items-center ">
        {/* Hero Text Section */}
        <div className="relative flex flex-col text-center items-center gap-4 px-2 lg:px-8">
          <h1
            className="font-light w-full text-[54px] lg:text-[128px] text-white"
            style={{
              fontFamily: "Sofia Pro, sans-serif",
              letterSpacing: "-0.03em",
              lineHeight: "1.05", // Tighter line spacing
            }}
          >
            Global Banking & Finance
            <span
              className="italic font-normal text-[#a5d2b1]"
              style={{
                fontFamily: "Instrument Serif, serif",
                letterSpacing: "-0.03em",
              }}
            >
              {" "}
              Fellowship
            </span>
          </h1>
          <div className="max-w-6xl mx-auto my-6 lg:text-3xl text-white px-5">
            Fintech | Venture Capital | Wealth & Private Banking | Credit & Risk
          </div>

          {/* CTA Button */}
          <div className="flex flex-col items-center justify-center gap-8 lg:mt-4 pb-10">
            <p className="max-w-2xl lg:text-2xl text-white/80 m-0">
              Taught by the leaders who shaped trillion-dollar finance
            </p>
            <Link
              href="/checkout?programId=global-banking-finance-fellowship"
              className="inline-flex items-center justify-center px-4 py-1 lg:px-12 lg:py-4 lg:text-xl font-medium text-black bg-[#a5d2b1] rounded-lg lg:rounded-2xl"
              style={{
                fontFamily: "Sofia Pro, sans-serif",
                letterSpacing: "-0.01em",
              }}
            >
              Enroll Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
