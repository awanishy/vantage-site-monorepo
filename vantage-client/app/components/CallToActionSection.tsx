import Link from "next/link";

const CallToActionSection = () => {
  return (
    <section className="bg-white py-20 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Main Heading */}
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 font-section-heading">
            Ready to Transform Your{" "}
            <span
              className="italic"
              style={{
                fontFamily: '"Chronicle Display Black", serif',
                color: "#568c65",
              }}
            >
              Finance Career?
            </span>
          </h2>

          {/* CTA Button */}
          <div className="flex justify-center mt-10">
            <Link
              href="/checkout?programId=global-banking-finance-fellowship"
              className="bg-[#a5d2b1] text-black px-10 py-4 rounded-lg font-semibold text-lg font-section-heading shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              Enroll Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;
