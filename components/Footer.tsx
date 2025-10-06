"use client";

import Image from "next/image";
import React from "react";
import { useMouse } from "@/components/MouseContext";

const Footer = () => {
  const mousePos = useMouse();

  return (
    <footer className="relative z-10 bg-white/90 backdrop-blur-xl border-t border-gray-200 overflow-hidden">
      {/* Floating blobs */}
      <div
        className="pointer-events-none absolute -top-32 -left-32 w-64 h-64 bg-blue-200/20 rounded-full filter blur-3xl animate-blob transition-transform duration-500"
        style={{
          transform: `translate(${mousePos.x * 0.03}px, ${mousePos.y * 0.03}px)`,
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 bg-purple-200/20 rounded-full filter blur-3xl animate-blob animation-delay-2000 transition-transform duration-500"
        style={{
          transform: `translate(${mousePos.x * -0.02}px, ${mousePos.y * -0.02}px)`,
        }}
      />

      <div className="mx-auto max-w-screen-2xl px-6 lg:px-8 py-16 relative z-10">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-12 lg:gap-24">
          {/* Logo */}
          <div className="flex-shrink-0 flex flex-col items-start space-y-4">
            <Image
              src="/logo v1.png"
              alt="Company Logo"
              width={120}
              height={120}
              className="h-auto w-auto transition-transform duration-700 ease-in-out hover:scale-110 hover:rotate-[5deg]"
            />
            <p className="text-gray-700 text-sm max-w-xs">
              Crafting modern designs with smooth experiences and sleek
              aesthetics.
            </p>
          </div>

          {/* Navigation */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 flex-1">
            {[
              { title: "Shop", links: ["Products", "New Arrivals", "Sale"] },
              {
                title: "About",
                links: ["Our Story", "Careers", "Sustainability"],
              },
              {
                title: "Support",
                links: ["Help Center", "Contact Us", "FAQs"],
              },
              {
                title: "Legal",
                links: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
              },
            ].map((section) => (
              <div key={section.title} className="space-y-4">
                <h3 className="text-blue-600 font-semibold">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link} className="relative group overflow-hidden">
                      <a
                        href="#"
                        className="relative text-gray-800 hover:text-blue-600 transition-colors"
                      >
                        {link}
                        <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-blue-600 transition-all group-hover:w-full"></span>
                        <span
                          className="ripple absolute inset-0 rounded-full bg-blue-200/20 opacity-0 pointer-events-none"
                          style={{
                            transform: `translate(${mousePos.x * 0.005}px, ${
                              mousePos.y * 0.005
                            }px)`,
                          }}
                        ></span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-gray-200 pt-6 flex flex-col sm:flex-row justify-between items-center text-gray-500 text-sm space-y-4 sm:space-y-0">
          <p>
            © {new Date().getFullYear()} Your Company. All rights reserved.
          </p>
          <div className="flex space-x-6">
            {["Twitter", "Instagram", "LinkedIn"].map((platform) => (
              <a
                key={platform}
                href="#"
                className="relative text-gray-500 hover:text-blue-600 transition-colors group overflow-hidden"
              >
                {platform}
                <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-blue-600 transition-all group-hover:w-full"></span>
                <span
                  className="ripple absolute inset-0 rounded-full bg-blue-200/20 opacity-0 pointer-events-none"
                  style={{
                    transform: `translate(${mousePos.x * 0.005}px, ${
                      mousePos.y * 0.005
                    }px)`,
                  }}
                ></span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
