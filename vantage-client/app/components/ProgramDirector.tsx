import Image from "next/image";

const ProgramDirector = () => {
  return (
    <section className="pt-4 bg-white border-b border-gray-600">
      <div className="text-center pb-5">
        <h2 className="text-3xl md:text-4xl font-bold text-black font-section-heading">
          Meet the Program{" "}
          <span
            className="italic"
            style={{
              fontFamily: '"Chronicle Display Black", serif',
              color: "#568c65",
            }}
          >
            Lead
          </span>{" "}
        </h2>
        {/* <p className="text-base md:text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
            Immersive learning experiences that prepare you for real-world
            challenges
          </p> */}
      </div>
      <div className="flex justify-center px-10 pt-5 pb-5 5xl:pb-0 5xl:pt-10 w-full h-auto mx-auto  bg-black relative ">
        <div className="hidden 5xl:flex max-w-[76rem] h-full  ">
          <div className="text-white h-full flex-1 pb-5">
            <p className="text-2xl sofia-pro-light">
              Syed Raza commanded a $1 trillion balance sheet at Barclays and
              earned recognition among the Financial Times Top 100 Banking
              Executives. He architected the Early Career Programme that became
              the industry blueprint for elite talent development. Now at
              Vantage, he channels this institutional expertise to cultivate
              students early on into the next generation of global finance
              leaders.
            </p>
            <div className="w-full mt-8 px-6 py-2 bg-[#A5D2B1] text-black flex flex-col">
              <h2 className="mb-2">
                <span className="text-lg font-bold">Syed Raza</span>

                <span className="text-md">, Co-founder & Lead Instructor</span>
              </h2>
              <span className="block text-md">
                Former C-level Managing Director, Barclays
              </span>
            </div>
          </div>

          <div className="relative flex-1">
            <img
              src="assets/syed-full.jpeg"
              alt="Programme Director"
              className="w-[400px] min-h-[480px] object-cover absolute right-0 bottom-0 z-10"
            />

            <div className="w-full h-[76px] relative top-[256px] mt-8 px-6 py-2 bg-[#A5D2B1] text-black flex flex-col"></div>
          </div>
        </div>

        {/* MOBILE CARD */}
        <div className="flex 5xl:hidden 5xl:w-[600px] flex-col items-center gap-2">
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
                Former MD & CEO, Barclays
              </span>
            </div>
          </div>
          <div className="flex flex-col ">
            <p className="text-sm text-white sofia-pro-light text-center">
              Syed Raza commanded a $1 trillion balance sheet at Barclays and
              earned recognition among the Financial Times Top 100 Banking
              Executives. He architected the Early Career Programme that became
              the industry blueprint for elite talent development. Now at
              Vantage, he channels this institutional expertise to cultivate
              students early on into the next generation of global finance
              leaders.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgramDirector;
