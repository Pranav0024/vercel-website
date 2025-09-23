import Link from "next/link";
import React from "react";

const IntroducingSection = () => {
  return (
    <div className="bg-gradient-to-l from-white to-blue-600 py-32 sm:py-24 px-6 sm:px-10">
      <div className="text-center flex flex-col gap-y-6 items-center">
        <h2 className="text-white text-6xl sm:text-8xl font-extrabold text-center mb-4 max-md:text-5xl max-[480px]:text-4xl">
          INTRODUCING <span className="text-black">PAN</span>
          <span className="text-blue-600">IAR</span>
        </h2>
        <p className="text-white text-center text-2xl sm:text-2xl font-semibold max-md:text-xl max-[480px]:text-base">
          One Stop Shop For Your Every Day Needs.
        </p>

        <Link
          href="/shop"
          className="group w-80 sm:w-96 max-md:w-72 max-[480px]:w-60 mt-4 transition-all duration-300"
        >
          <button className="bg-white/20 backdrop-blur-md border border-white/30 px-10 py-3 rounded-2xl text-blue-600 font-bold hover:bg-white/30 hover:scale-105 transition-all duration-300 w-full">
            SHOP NOW
          </button>
        </Link>
      </div>
    </div>
  );
};

export default IntroducingSection;
