"use client";
import React from "react";
import Image from "next/image";

const CertificateSection = () => {
  return (
    <section className="bg-black">
      <div className="px-4 py-10 lg:pb-15 mx-auto max-w-7xl">
        <div className="rounded-3xl shadow-lg py-6 lg:py-8 px-6 lg:pl-10 lg:pr-0 grid lg:grid-cols-[1fr_1fr] lg:gap-x-20 gap-y-6 bg-white">
          {/* Content Section */}
          <div className="flex flex-col justify-center lg:justify-start items-center lg:text-left lg:items-start text-center">
            <div className="text-2xl sm:text-3xl lg:text-4xl leading-tight font-bold text-black font-section-heading">
              <p>
                Stand out with the{" "}
                <span
                  className="italic"
                  style={{
                    fontFamily: '"Chronicle Display Black", serif',
                    color: "#568c65",
                  }}
                >
                  Vantage Certificate
                </span>
              </p>
            </div>
            <div className="text-base sm:text-lg lg:text-xl text-black mt-3 lg:mt-5 tracking-tight leading-relaxed">
              <p>
                Earn the Vantage Certificate and elevate your profile with a
                recruiter-reviewed resume, LinkedIn optimisation, and a mock
                interview from an investment banking recruiter.
              </p>
            </div>
          </div>
          
          {/* Certificate Image Section */}
          <div className="relative h-64 sm:h-72 lg:h-70">
            <Image
              alt="LinkedIn Certificate Preview"
              src="/assets/certificate.png"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CertificateSection;