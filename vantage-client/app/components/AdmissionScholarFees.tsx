"use client";
import React from "react";

const AdmissionScholarshipFees = () => {
  const steps = [
    {
      step: "Step 01",
      title: "Apply Submit your application",
      description:
        "Complete your online application form with all required documents and personal information.",
    },
    {
      step: "Step 02",
      title: "Interview Interaction with the founding team to assess fit",
      description:
        "Our admissions team will review your application and conduct a comprehensive assessment.",
    },
    {
      step: "Step 03",
      title: "Join Us Receive your decision & secure your Fellowship spot",
      description:
        "Receive your admission decision and begin your journey with us upon acceptance.",
    },
  ];

  const scholarshipInfo = {
    title: "Scholarship",
    description:
      "Up to 100% tuition support for outstanding candidates and those from underrepresented backgrounds.",
    deadline: "Applications due by September 25th",
  };

  return (
    <section className="bg-black border-b broder-gray-800 ">
      <div className="px-4 pt-8 lg:pt-[50px] mx-auto max-w-[1272px] ">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white font-section-heading">
            Admission,{" "}
            <span
              className="italic"
              style={{
                fontFamily: '"Chronicle Display Black", serif',
                color: "#a5d2b0",
              }}
            >
              Scholarship
            </span>{" "}
            & Fees
          </h2>
        </div>

        {/* Two Cards Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
          {/* Card 1: Admission Process */}
          <div className="lg:p-8">
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={index} className=" pl-4">
                  <h4 className="font-bold text-lg text-[#568c65] mb-1">
                    <span
                      className="italic p-2"
                      style={{
                        fontFamily: '"Chronicle Display Black", serif',
                        color: "#a5d2b0",
                      }}
                    >
                      {step.step}
                    </span>
                  </h4>
                  <hr />
                  <div className=" text-white rounded-lg p-2 text-xl">
                    <h2 className="font-light mb-2 tracking-tight">
                      {step.title}
                    </h2>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scholarship Card */}

          <div className="mt-10 mb-10 lg:h-[295] rounded-2xl bg-[#a5d2b0] text-black px-6 pt-6 pb-4 ">
            <h3 className="text-3xl font-bold ">
              <span
                className="italic"
                style={{
                  fontFamily: '"Chronicle Display Black", serif',
                }}
              >
                {scholarshipInfo.title}
              </span>
            </h3>
            <p className="text-xl mt-4 mb-12">{scholarshipInfo.description}</p>
            <span
              className="font-bold text-4xl italic "
              style={{
                fontFamily: '"Chronicle Display Black", serif',
              }}
            >
              INR 14,999{" "}
            </span>
            (All inclusive)
            <p className="text-xl mt-5 pb-2 italic">
              {scholarshipInfo.deadline} <sup>*</sup>
            </p>
          </div>
        </div>

        {/* Program Fee Card */}
      </div>
    </section>
  );
};

export default AdmissionScholarshipFees;
