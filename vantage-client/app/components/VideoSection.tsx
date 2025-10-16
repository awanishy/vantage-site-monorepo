const VideoSection = () => {
  return (
    <section className="pt-10  bg-black border-b border-gray-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Video Container */}
        <div className="relative w-full max-w-2xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <video
              className="w-full h-auto"
              controls
              preload="metadata"
              playsInline
            >
              <source src="/fellowship-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
