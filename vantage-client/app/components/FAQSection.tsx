"use client";
import React, { useState } from "react";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is the duration of the Global Banking & Finance Fellowship?",
      answer: "The fellowship is a 2-week intensive program with 8-10 hours of commitment per week, including daily live sessions and online material access."
    },
    {
      question: "Who is eligible to apply for this fellowship?",
      answer: "The program is designed for final-year undergraduates, postgraduates, and early-career professionals who are passionate about finance and want to advance their careers in the industry."
    },
    {
      question: "What will I learn in this fellowship?",
      answer: "You'll gain comprehensive knowledge in venture capital & startups, fintech & innovation, global banking & wealth management, credit & risk management, and capital markets & trading through hands-on learning with industry experts."
    },
    {
      question: "Are there any prerequisites or prior experience required?",
      answer: "No specific prerequisites are required. The program is designed to accommodate participants with varying levels of experience, from beginners to those with some finance background looking to deepen their expertise."
    },
    {
      question: "What kind of support and mentorship will I receive?",
      answer: "You'll receive mentorship from distinguished CEOs, MDs, and senior executives from leading financial institutions, along with access to our network of industry practitioners and ongoing career guidance."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-white py-20 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 font-section-heading">
            Frequently Asked{" "}
            <span 
              className="italic"
              style={{
                fontFamily: '"Chronicle Display Black", serif',
                color: "#568c65",
              }}
            >
              Questions
            </span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
            Everything you need to know about the Global Banking & Finance Fellowship
          </p>
        </div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-gray-200 last:border-b-0"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left py-6 px-0 focus:outline-none group"
                aria-expanded={openIndex === index}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 font-section-heading pr-4">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    <svg
                      className={`w-6 h-6 text-gray-500 transition-transform duration-200 ${
                        openIndex === index ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="pb-6">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      
      </div>
    </section>
  );
};

export default FAQSection;
