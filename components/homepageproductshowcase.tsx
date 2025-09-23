// components/HomepageProductShowcase.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import products from "@/data/products"; // assumes default export from data/products.ts
import WhatsAppButton from "@/components/WhatsAppButton";

export type ProductType = {
  id: string;
  name: string;
  price: string;
  mainImage?: string;
  link?: string;
};

const PHONE_NUMBER = "918360746541"; // replace if needed

export default function HomepageProductShowcase() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [rotations, setRotations] = useState<Record<number, { x: number; y: number }>>({});
  const [visible, setVisible] = useState<Record<number, boolean>>({});

  // IntersectionObserver - reveal on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idxAttr = entry.target.getAttribute("data-index");
          if (!idxAttr) return;
          const idx = parseInt(idxAttr, 10);
          if (entry.isIntersecting) {
            setVisible((s) => (s[idx] ? s : { ...s, [idx]: true }));
          }
        });
      },
      { threshold: 0.18 }
    );

    cardRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // 3D tilt handlers
  function handleMouseMove(index: number, e: React.MouseEvent<HTMLDivElement>) {
    const el = cardRefs.current[index];
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 12; // rotateY
    const y = ((e.clientY - r.top) / r.height - 0.5) * -12; // rotateX
    setRotations((s) => ({ ...s, [index]: { x, y } }));
  }
  function handleMouseLeave(index: number) {
    setRotations((s) => ({ ...s, [index]: { x: 0, y: 0 } }));
  }

  // Defensive: ensure `products` is an array of ProductType
  const items: ProductType[] = Array.isArray(products) ? products : [];

  return (
    <section className="relative py-20 px-6 sm:px-10 overflow-hidden">
      {/* Gradient background + soft orbs */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-800 via-blue-700 to-indigo-900 opacity-95 -z-10" />
      <div className="absolute -left-40 -top-40 w-[420px] h-[420px] rounded-full blur-[160px] bg-purple-600 opacity-30 -z-10" />
      <div className="absolute right-[-80px] bottom-[-80px] w-[420px] h-[420px] rounded-full blur-[160px] bg-blue-600 opacity-28 -z-10" />

      <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-14 text-center drop-shadow-lg">
        Our Products
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-screen-2xl mx-auto">
        {items.map((product, index) => {
          const rot = rotations[index] ?? { x: 0, y: 0 };
          const isVisible = Boolean(visible[index]);

          return (
            <div
              key={product.id}
              data-index={index}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              onMouseMove={(e) => handleMouseMove(index, e)}
              onMouseLeave={() => handleMouseLeave(index)}
              style={{
                transform: `perspective(900px) rotateX(${rot.y}deg) rotateY(${rot.x}deg)`,
                transition: "transform 180ms ease, box-shadow 180ms ease",
              }}
              className={`relative rounded-3xl p-5 overflow-hidden bg-white/8 backdrop-blur-xl border border-white/20 shadow-xl
                ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
                transition-all duration-500`}
            >
              {/* hover glow overlay */}
              <div
                className="absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-300 opacity-0 hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(120deg, rgba(124,58,237,0.06), rgba(59,130,246,0.05))",
                }}
              />

              {/* image box - fixed size to keep uniform cards */}
              <div className="w-full h-56 md:h-64 relative rounded-2xl overflow-hidden bg-white/6 flex items-center justify-center">
                <Image
                  src={product.mainImage || "/placeholder1.png"}
                  alt={product.name || "Product"}
                  fill
                  sizes="(max-width: 768px) 300px, (max-width: 1280px) 420px, 480px"
                  className="object-contain p-4"
                />
              </div>

              <div className="w-full flex-1 flex flex-col items-center gap-3 mt-3">
                <h3 className="text-lg md:text-xl font-semibold text-white text-center leading-tight">
                  {product.name}
                </h3>
                <p className="text-purple-300 font-bold text-lg">{product.price}</p>

                <div className="w-full mt-2">
                  <WhatsAppButton product={{ ...product, mainImage: product.mainImage ?? "" }} phoneNumber={PHONE_NUMBER} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
