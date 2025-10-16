"use client";
import React, { useRef, useEffect } from "react";
import Image from "next/image";

export default function MentorsSection() {
  const lowerRowRef = useRef<HTMLDivElement>(null);

  const bottomBrands = [
    "/assets/mentors-companies/7fiftytwo.jpeg",
    "/assets/mentors-companies/ANZ-Logo-2009.svg.png",
    "/assets/mentors-companies/barclays (1).png",
    "/assets/mentors-companies/blue ashva.png",
    "/assets/mentors-companies/bny-logo---2024-brand-update.png",
    "/assets/mentors-companies/centrum wealth .jpg",
    "/assets/mentors-companies/Llyods Bank.png",
    "/assets/mentors-companies/oliver.png",
    "/assets/mentors-companies/Standard_Chartered_(2021).svg.png",
  ];

  // Logo animation functionality
  useEffect(() => {
    const lowerRow = lowerRowRef.current;
    if (!lowerRow) return;

    let animationId: number;
    let translateX = 0;
    const speed = 0.5; // pixels per frame
    const logoWidth = 77;
    const gap = 64;
    const totalWidth = (logoWidth + gap) * bottomBrands.length;

    const animate = () => {
      translateX -= speed;
      // Reset position when we've moved exactly one set of logos
      // This ensures seamless loop since we have duplicate logos
      if (Math.abs(translateX) >= totalWidth) {
        translateX = 0;
      }
      lowerRow.style.transform = `translateX(${translateX}px)`;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [bottomBrands.length]);

  return (
    <section
      id="meet-mentors"
      className="pt-10  bg-white border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-black font-section-heading">
            Learn from{" "}
            <span
              className="italic"
              style={{
                fontFamily: '"Chronicle Display Black", serif',
                color: "#568c65",
              }}
            >
              MDs, CEOs,
            </span>{" "}
            and seasoned leaders across global banks, wealth firms, and venture
            capital.
          </h2>
          {/* <p className="text-base md:text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
            Your mentors comes from
          </p> */}
        </div>

        {/* Company Logos Animation */}
        <div className="mt-10">
          <div className="bg-white py-6 overflow-hidden">
            <div
              ref={lowerRowRef}
              className="flex space-x-16 will-change-transform"
              style={{
                width: `${(77 + 64) * bottomBrands.length * 3}px`,
                transform: "translateX(0px)",
              }}
            >
              {/* First set of logos */}
              {bottomBrands.map((brand, index) => (
                <div
                  key={`lower-${index}`}
                  className="flex-shrink-0 h-[38px] flex items-center"
                >
                  <Image
                    src={brand}
                    alt={`Company ${index + 1}`}
                    width={77}
                    height={38}
                    className="max-h-[38px] w-auto brightness-[1.1]"
                    style={{ objectFit: "contain" }}
                  />
                </div>
              ))}
              {/* Second set for seamless loop */}
              {bottomBrands.map((brand, index) => (
                <div
                  key={`lower-dup-${index}`}
                  className="flex-shrink-0 h-[38px] flex items-center"
                >
                  <Image
                    src={brand}
                    alt={`Company ${index + 1}`}
                    width={77}
                    height={38}
                    className="max-h-[38px] w-auto brightness-[1.1]"
                    style={{ objectFit: "contain" }}
                  />
                </div>
              ))}
              {/* Third set for extra coverage */}
              {bottomBrands.map((brand, index) => (
                <div
                  key={`lower-dup2-${index}`}
                  className="flex-shrink-0 h-[38px] flex items-center"
                >
                  <Image
                    src={brand}
                    alt={`Company ${index + 1}`}
                    width={77}
                    height={38}
                    className="max-h-[38px] w-auto brightness-[1.1]"
                    style={{ objectFit: "contain" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .will-change-transform {
          will-change: transform;
        }
      `}</style>
    </section>
  );
}
