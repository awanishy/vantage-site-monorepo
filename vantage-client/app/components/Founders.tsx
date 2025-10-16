import React from "react";
import Image from "next/image";

const Founders = () => {
  return (
    <section
      id="meet-founders"
      className="pt-10 bg-white border-b border-gray-200 relative"
    >
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 ">
        {/* Founders Title */}
        <div>
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-black font-section-heading">
              Meet the{" "}
              <span
                className="italic"
                style={{
                  fontFamily: '"Chronicle Display Black", serif',
                  color: "#568c65",
                }}
              >
                Founders
              </span>
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
              From building institutions to shaping global markets, now{" "}
              <b> reimagining what education was meant to be</b>
            </p>
          </div>
        </div>

        {/* Founders Cards - Side by Side */}
      </div>

      <div className="mt-8 w-full bg-[#f7f7f7] pt-5 overflow-x-auto">
        <div className="w-[40rem] sm:w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="grid grid-cols-2 sm:gap-12">
            {/* Syed's Card */}
            <div className="flex flex-col items-center sm:items-start sm:flex-row gap-3">
              <div
                className="relative flex justify-center overflow-hidden"
                style={{
                  width: "250px",
                  height: "250px",
                  borderRadius: "8px",
                }}
              >
                <Image
                  src="/assets/syed_raza-long.png"
                  alt="Syed Raza"
                  quality={100}
                  className="object-cover object-top transition-all duration-300"
                  width={300}
                  height={180}
                />
                {/* Solid white div positioned relative to image */}
                <div
                  className="absolute bottom-[5%] left-1/2 transform -translate-x-1/2 w-4/5 h-12 bg-white border border-gray-200 z-10 flex flex-col items-center justify-center"
                  style={{ borderRadius: "5px" }}
                >
                  <span className="text-black text-xs sm:text-sm lg:text-base font-semibold tracking-wide leading-tight">
                    Syed{" "}
                    <span
                      style={{
                        fontFamily: '"Chronicle Display Black", serif',
                        color: "#568c65",
                        fontStyle: "italic",
                      }}
                    >
                      Raza
                    </span>
                  </span>
                  <span
                    className="text-xs text-gray-600"
                    style={{
                      color: "#4B5563",
                      fontStyle: "italic",
                      fontFamily: '"Sofia Pro Light", sans-serif',
                      fontWeight: 300,
                    }}
                  >
                    Co-Founder
                  </span>
                </div>
              </div>
              <div className="w-[295px] flex flex-col mt-4">
                <p
                  className="text-sm sm:text-sm leading-snug tracking-wide"
                  style={{
                    fontFamily: '"Sofia Pro Bold Az", sans-serif',
                    color: "#1a1a1a",
                  }}
                >
                  <span
                    className="text-[1rem]"
                    style={{
                      fontStyle: "italic",
                      color: "#568C65",
                      fontFamily: '"Chronicle Display Black", serif',
                    }}
                  >
                    From steering trillion-dollar balance sheets to shaping
                    fintech ventures,
                  </span>{" "}
                  <span
                    className="text-[1rem]"
                    style={{
                      color: "#4B5563",
                      fontStyle: "italic",
                      fontFamily: '"Sofia Pro Light", sans-serif',
                      fontWeight: 300,
                    }}
                  >
                    now opening doors to the world of high finance once guarded
                    by Ivy League halls and global boardrooms.
                  </span>
                </p>
                {/* Company Logos with Designations */}
                <div className="flex flex-col gap-2 mt-8 pb-2">
                  <div className="flex items-center gap-0 w-full">
                    <div className="w-9 flex-shrink-0">
                      <Image
                        src="/assets/barclays-short-logo.png"
                        alt="Barclays logo"
                        width={25}
                        height={20}
                        className="h-5 sm:h-4 lg:h-5 object-contain transition-opacity duration-200"
                        quality={100}
                      />
                    </div>
                    <span className="text-xs font-normal text-gray-500">
                      Former MD & CEO, Barclays (UK & Americas)
                    </span>
                  </div>
                  <div className="flex items-start gap-0 w-full">
                    <div className="w-9 flex-shrink-0">
                      <Image
                        src="/assets/lamaa-short-logo.png"
                        alt="Lamaa logo"
                        width={25}
                        height={36}
                        className="h-5 sm:h-4 lg:h-5 object-contain transition-opacity duration-200"
                        quality={100}
                      />
                    </div>
                    <span className="text-xs font-normal text-gray-500">
                      Former CEO, Lamaa Saudi
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Image
                      src="/assets/oxford-logo.png"
                      alt="Oxford logo"
                      width={80} // increase width
                      height={22} // adjust height proportionally
                      className="h-6 sm:h-5 lg:h-7 w-auto object-contain transition-opacity duration-200 flex-shrink-0"
                      unoptimized
                      quality={100}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Manish's Card */}
            <div className="flex flex-col items-center sm:items-start sm:flex-row gap-3">
              <div
                className="relative flex justify-center overflow-hidden"
                style={{
                  width: "250px",
                  height: "250px",
                  // backgroundColor: "#EBEBEB",
                  borderRadius: "8px",
                }}
              >
                <Image
                  src="/assets/manish-long-photo.png"
                  alt="Dr. Manish Malhotra"
                  quality={100}
                  className="object-cover object-top transition-all duration-300"
                  width={300}
                  height={180}
                />
                {/* Solid white div positioned relative to image */}
                <div
                  className="absolute bottom-[5%] left-1/2 transform -translate-x-1/2 w-4/5 h-12 bg-white border border-gray-200 z-10 flex flex-col items-center justify-center"
                  style={{ borderRadius: "5px" }}
                >
                  <span className="text-black text-xs sm:text-sm lg:text-base font-semibold tracking-wide leading-tight">
                    Dr. Manish{" "}
                    <span
                      style={{
                        fontFamily: '"Chronicle Display Black", serif',
                        color: "#568c65",
                        fontStyle: "italic",
                      }}
                    >
                      Malhotra
                    </span>
                  </span>
                  <span
                    className="text-xs text-gray-600"
                    style={{
                      color: "#4B5563",
                      fontStyle: "italic",
                      fontFamily: '"Sofia Pro Light", sans-serif',
                      fontWeight: 300,
                    }}
                  >
                    Co-Founder
                  </span>
                </div>
              </div>
              <div className="w-[295px] flex flex-col mt-4">
                <p
                  className="text-sm sm:text-sm leading-snug tracking-wide"
                  style={{
                    fontFamily: '"Sofia Pro Bold Az", sans-serif',
                    color: "#1a1a1a",
                  }}
                >
                  {/* <span
                    style={{
                      fontSize: "1.5rem",
                      color: "#4B5563",
                      lineHeight: "1",
                    }}
                  >
                    "
                  </span> */}
                  <span
                    className="text-[1rem]"
                    style={{
                      fontStyle: "italic",
                      color: "#568C65",
                      fontFamily: '"Chronicle Display Black", serif',
                    }}
                  >
                    From scaling & exiting multi-million-dollar ventures
                    worldwide,
                  </span>{" "}
                  <span
                    className="text-[1rem]"
                    style={{
                      color: "#4B5563",
                      fontStyle: "italic",
                      fontFamily: '"Sofia Pro Light", sans-serif',
                      fontWeight: 300,
                    }}
                  >
                    now building what learning should’ve always been where
                    students go from zero to one hundred & create at scale.
                  </span>
                  {/* <span
                    style={{
                      fontSize: "1.5rem",
                      color: "#4B5563",
                      lineHeight: "1",
                    }}
                  >
                    "
                  </span> */}
                </p>
                {/* Company Logos with Designations */}
                <div className="flex flex-col items-start gap-2 mt-8 pb-2">
                  <div className="flex items-center gap-0 w-full">
                    <div className="w-16 flex-shrink-0">
                      <Image
                        src="/assets/atmc-short.png"
                        alt="ATMC logo"
                        width={50}
                        height={18}
                        className="h-5 sm:h-5 lg:h-5 object-contain transition-opacity duration-200"
                        quality={100}
                      />
                    </div>
                    <span className="text-xs font-normal text-gray-500">
                      Ex MD & CEO, ATMC Australia
                    </span>
                  </div>
                  <div className="flex items-start gap-0 w-full">
                    <div className="w-16 flex-shrink-0">
                      <Image
                        src="/assets/employability-short.png"
                        alt="Employability logo"
                        width={22}
                        height={36}
                        className="h-5 sm:h-5 lg:h-5 object-contain transition-opacity duration-200"
                        quality={100}
                      />
                    </div>
                    <span className="text-xs font-normal text-gray-500">
                      Ex-Founder & CEO, Employability.life
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Image
                      src="/assets/rmit-university.svg"
                      alt="RMIT University logo"
                      width={60}
                      height={18}
                      className="h-5 sm:h-6 lg:h-5 w-auto object-contain transition-opacity duration-200 flex-shrink-0"
                      quality={100}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Founders;
