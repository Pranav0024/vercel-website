"use client";

import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";

const images = [
  "/1.png",
  "/2.png",
  "/3.png",
  "/4.png",
];

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [shadow, setShadow] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
    setRotation({ x, y });
    const shadowX = ((e.clientX - rect.left) / rect.width - 0.5) * 30;
    const shadowY = ((e.clientY - rect.top) / rect.height - 0.5) * 30;
    setShadow({ x: shadowX, y: shadowY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setShadow({ x: 0, y: 0 });
  };

  return (
    <div className="w-full bg-blue-500 relative overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 py-16 md:py-24 lg:py-32 grid grid-cols-12 items-center gap-8 lg:gap-16">
        {/* Left text panel */}
        <div className="col-span-12 lg:col-span-6 xl:col-span-5">
          <div className="bg-white/20 backdrop-blur-lg border border-white/30 p-8 rounded-3xl shadow-lg flex flex-col gap-y-5">
            <h1 className="text-5xl lg:text-6xl text-white font-bold mb-3 max-md:text-4xl max-sm:text-3xl">
              INNOVATIVE TOOLS, ENDLESS POSSIBILITIES
            </h1>
            <p className="text-white max-sm:text-sm">
              Bringing together a complete range of products crafted with innovation, style, and quality—explore them all today.
            </p>

            <div className="flex gap-x-4 max-lg:flex-col max-lg:gap-y-3 mt-3">
              <Link href="/shop" className="group">
                <button className="bg-white/20 backdrop-blur-md border border-white/30 px-10 py-3 rounded-2xl text-blue-600 font-bold hover:bg-white/30 transition-all duration-300 group-hover:scale-105">
                  Explore More
                </button>
              </Link>
              <a
                href="https://wa.me/918360746541?text=Hello%2C%20I%20want%20to%20know%20more%20about%20your%20products"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <button className="bg-white/20 backdrop-blur-md border border-white/30 px-10 py-3 rounded-2xl text-blue-600 font-bold hover:bg-white/30 transition-all duration-300 group-hover:scale-105">
                  Get In Touch
                </button>
              </a>
            </div>
          </div>
        </div>

{/* Right carousel panel */}
<div className="col-span-12 lg:col-span-6 xl:col-span-7 flex justify-center mt-8 lg:mt-0">
  <div
    ref={cardRef}
    onMouseMove={handleMouseMove}
    onMouseLeave={handleMouseLeave}
    className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-3xl shadow-xl p-6 w-[90%] max-w-lg sm:max-w-xl md:max-w-2xl h-[350px] sm:h-[450px] md:h-[550px] flex items-center justify-center relative overflow-hidden transition-transform duration-300 transform"
    style={{
      transform: `rotateX(${rotation.y}deg) rotateY(${rotation.x}deg)`,
      boxShadow: `${shadow.x}px ${shadow.y}px 50px rgba(255,255,255,0.3)`,
    }}
  >
    {images.map((src, index) => (
      <div
        key={index}
        className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
          index === currentImage ? "opacity-100" : "opacity-0"
        }`}
      >
        <Image
          src={src}
          alt={`carousel-${index}`}
          fill
          className="object-contain rounded-2xl"
          priority={index === 0}
        />
      </div>
    ))}
  </div>
</div>

      </div>
    </div>
  );
};

export default Hero;
