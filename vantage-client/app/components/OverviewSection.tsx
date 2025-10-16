"use client";
import React, { useState } from "react";
import Image from "next/image";
import { X, Play } from "lucide-react";

const VideoSection = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const openVideoModal = () => {
    setIsVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
  };

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Close modal if clicking on the backdrop (not on the video container)
    if (e.target === e.currentTarget) {
      closeVideoModal();
    }
  };

  return (
    <>
      {/* Video Section */}
      <section className="bg-black py-16" id="overview">
        <div className="px-4 mx-auto max-w-[1272px]">
          {/* Header Section */}
          <div className="text-center mb-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white font-section-heading">
              Step Into the{" "}
              <span
                className="italic"
                style={{
                  fontFamily: '"Chronicle Display Black", serif',
                  color: "#a5d2b0",
                }}
              >
                Fellowship
              </span>
            </h2>
          </div>
          <p className="text-sm lg:text-lg text-white leading-relaxed text-center mb-12">
            Led by MDs and CEOs from top investment banks, wealth firms, and VC
            funds, this fellowship gives a select cohort a closed-door view of
            how leaders think & strategize in ESG, fintech, credit, private
            banking, & risk, while building the networks & edge to break into
            the most competitive roles in finance
          </p>

          {/* Video Thumbnail Section - Full Width */}
          <div className="flex justify-center">
            <div className="w-full max-w-4xl">
              <div
                className="relative w-full h-[200px] md:h-[350px] lg:h-[500px] cursor-pointer group overflow-hidden rounded-2xl"
                onClick={openVideoModal}
              >
                <Image
                  alt="Video Thumbnail"
                  src="/assets/syedThumbnail.jpeg"
                  fill
                  className="object-fill transition-transform group-hover:scale-102"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
                />

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                  <div className="bg-white/90 hover:bg-white rounded-full p-3 sm:p-4 md:p-6 transition-all duration-200 group-hover:scale-110 transform">
                    <Play
                      size={32} // Mobile size
                      className="text-black fill-black ml-0.5 sm:hidden"
                    />
                    <Play
                      size={48} // Tablet size
                      className="text-black fill-black ml-0.5 hidden sm:block md:hidden"
                    />
                    <Play
                      size={64} // Desktop size
                      className="text-black fill-black ml-1 hidden md:block"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={handleModalClick}
        >
          <div className="relative w-full max-w-4xl mx-auto">
            {/* Close Button */}
            <button
              onClick={closeVideoModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
              aria-label="Close video"
            >
              <X size={32} />
            </button>

            {/* Video Container */}
            <div
              className="relative w-full"
              style={{ paddingBottom: "56.25%" }}
            >
              <iframe
                src="https://drive.google.com/file/d/1pFWkTZ2MSSPKh1-XSX4jkI4_1_AqBEAr/preview"
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                allow="autoplay"
                allowFullScreen
                title="Video Player"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoSection;
