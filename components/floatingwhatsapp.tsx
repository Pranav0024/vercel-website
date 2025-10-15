"use client";

import React, { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import Image from "next/image";

const FloatingWhatsApp: React.FC = () => {
  const whatsappNumber = "918360746541";
  const message = "Hello, I want to know more about your products";

  const [visible, setVisible] = useState<boolean>(true);
  const [lastScrollY, setLastScrollY] = useState<number>(0);
  const [isPressed, setIsPressed] = useState<boolean>(false);

  // Hide/show button on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-4 right-4 z-50 transform transition-transform duration-500 ease-out
        ${visible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
    >
      <div
        className={`
          w-12 h-12 p-4 sm:w-16 sm:h-16 flex items-center justify-center rounded-full shadow-lg
          cursor-pointer bg-white/20 backdrop-blur-md border border-white/30
          transition-all duration-300
          ${isPressed ? "scale-110" : "hover:scale-105 active:scale-110"}
          animate-[float_3s_ease-in-out_infinite]
        `}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        onTouchStart={() => setIsPressed(true)}
        onTouchEnd={() => setIsPressed(false)}
      >
        {/* <Image
          src="/whatsapp.png"
          alt="WhatsApp"
          width={50}
          height={50}
          priority
        /> */}
        <FaWhatsapp
          size={50}
          className="text-green-500 drop-shadow-lg"
        />
      </div>
    </a>
  );
};

export default FloatingWhatsApp;
