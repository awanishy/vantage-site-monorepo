import React from 'react';

const AdmissionProcess = () => {
  const steps = [
    {
      step: "Step 01",
      title: "Application Submission",
      description: "Complete your online application form with all required documents and personal information."
    },
    {
      step: "Step 02", 
      title: "Review & Assessment",
      description: "Our admissions team will review your application and conduct a comprehensive assessment."
    },
    {
      step: "Step 03",
      title: "Final Decision",
      description: "Receive your admission decision and begin your journey with us upon acceptance."
    }
  ];

  return (
    <section className="bg-white py-16 px-4">
      <div className="mx-auto max-w-[1272px]">
        {/* Heading */}
        <div className="mb-16 text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-black font-section-heading">
            Admission{" "}
            <span
              className="italic"
              style={{
                fontFamily: '"Chronicle Display Black", serif',
                color: "#568c65",
              }}
            >
              Process
            </span>
          </h2>
        </div>

        {/* Steps Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item, index) => (
            <div key={index} className="flex flex-col">
              {/* Step Label */}
              <div className="mb-6">
                <h3 
                  className="text-4xl md:text-5xl font-bold text-black italic"
                  style={{
                    fontFamily: '"Chronicle Display Black", serif',
                  }}
                >
                  {item.step}
                </h3>
              </div>
              
              {/* Black Card */}
              <div className="bg-black rounded-2xl p-8 flex-1 flex flex-col justify-center">
                <h4 className="text-2xl font-bold text-white mb-4">
                  {item.title}
                </h4>
                <p className="text-gray-300 text-base leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdmissionProcess;