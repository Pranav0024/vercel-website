// /components/productshowcase.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import WhatsAppButton from "./WhatsAppButton";
import { Product } from "@/types/types";

type ProductShowcaseProps = {
  product: Product;
  phoneNumber: string;
};

export default function ProductShowcase({
  product,
  phoneNumber,
}: ProductShowcaseProps) {
  const [currentImage, setCurrentImage] = useState(0);

  // product.mainImage is REQUIRED in shared Product type -> safe to use directly
  const carouselImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.mainImage];

  const nextImage = () =>
    setCurrentImage((prev) => (prev + 1) % carouselImages.length);
  const prevImage = () =>
    setCurrentImage((prev) =>
      prev === 0 ? carouselImages.length - 1 : prev - 1,
    );

  return (
    <div className="shadow-md rounded-2xl border hover:shadow-lg transition p-4 flex flex-col items-center text-center bg-white relative">
      <div className="relative w-full h-56 mb-4 overflow-hidden rounded-xl">
        <Image
          src={carouselImages[currentImage]}
          alt={product.name}
          fill
          className="object-cover transition-all duration-500"
        />

        {carouselImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/50 hover:bg-white/80 rounded-full p-1 shadow-md"
            >
              ◀
            </button>
            <button
              onClick={nextImage}
              aria-label="Next image"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/50 hover:bg-white/80 rounded-full p-1 shadow-md"
            >
              ▶
            </button>
          </>
        )}
      </div>

      <h2 className="text-lg font-semibold">{product.name}</h2>
      <p className="text-gray-600 mt-1">
        {product.price ? product.price : "Price on request"}
      </p>

      <div className="mt-4 w-full">
        <WhatsAppButton
          product={product}
          phoneNumber={phoneNumber}
          className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors rounded-xl py-3 font-semibold shadow-md hover:shadow-lg"
        />
      </div>
    </div>
  );
}
