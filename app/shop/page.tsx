"use client";

export const dynamic = "force-dynamic";

import React from "react";
import Image from "next/image";
import products from "@/data/products";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useMouse } from "@/components/MouseContext";

const ShopPage = () => {
  const phoneNumber = "918360746541"; // change to your WhatsApp number
  const mousePos = useMouse();

  return (
    <div className="relative bg-white text-black py-16 overflow-hidden">
      {/* Floating blobs behind grid */}
      <div
        className="pointer-events-none absolute -top-32 -left-32 w-72 h-72 bg-blue-300/20 rounded-full filter blur-3xl animate-blob transition-transform duration-500"
        style={{
          transform: `translate(${mousePos.x * 0.03}px, ${mousePos.y * 0.03}px)`,
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 bg-purple-300/20 rounded-full filter blur-3xl animate-blob animation-delay-2000 transition-transform duration-500"
        style={{
          transform: `translate(${mousePos.x * -0.02}px, ${mousePos.y * -0.02}px)`,
        }}
      />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 w-80 h-80 bg-pink-200/20 rounded-full filter blur-3xl animate-blob animation-delay-4000 transition-transform duration-500"
        style={{
          transform: `translate(${mousePos.x * -0.01}px, ${mousePos.y * 0.01}px)`,
        }}
      />

      <div className="max-w-screen-2xl mx-auto px-6 relative z-10">
        <h1 className="text-4xl font-bold mb-12 text-center uppercase tracking-widest text-gray-900">
          Our Products
        </h1>

        {products.length === 0 ? (
          <p className="text-center text-gray-500">No products available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {products.map((product) => (
              <div
                key={product.id}
                className="relative bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl shadow-lg p-6 flex flex-col items-center text-center transition-transform duration-500 hover:scale-105 hover:shadow-2xl"
              >
                <div className="relative w-full h-64 mb-6 rounded-2xl overflow-hidden">
                  <Image
                    src={product.mainImage}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {product.name}
                </h2>
                <p className="text-gray-700 mb-4">
                  {product.price ? `${product.price}` : "Price on request"}
                </p>

                <div className="w-full">
                  <WhatsAppButton
                    product={product}
                    phoneNumber={phoneNumber}
                    className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors rounded-xl py-3 font-semibold shadow-md hover:shadow-lg"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
