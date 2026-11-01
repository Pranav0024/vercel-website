"use client";

export const dynamic = "force-dynamic";

import React, { PropsWithChildren, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { CiStar } from "react-icons/ci";
import { Camera } from "lucide-react";
import products from "@/data/products";
import type { Product } from "@/types/types";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useMouse } from "@/components/MouseContext";

const ShopPage = () => {
  const phoneNumber = "918360746541";
  const mousePos = useMouse();

  return (
    <div className="relative bg-white text-black py-16 overflow-hidden">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {products.map((product) => (
              <ProductCard key={product.id} item={product} phoneNumber={phoneNumber} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export interface ProductCardProps {
  item: Product | null
  phoneNumber: string
}

const Card: React.FC<PropsWithChildren & { className?: string }> = ({ children, className }) => {

  return <div className={twMerge("flex flex-col justify-between bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl shadow-lg p-6", className)}>
    {children}
  </div>

}

export const ProductCard = ({ item, phoneNumber }: ProductCardProps) => {
  const coverSlide = useMemo(
    () =>
      item?.mainImage ? { reference: item.mainImage, altText: item.name } : (item?.images && item.images.length > 0) ?
        { reference: item.images[0] ?? null, altText: item.name } : null,
    [item]
  )

  const strikeThroughPrice = useMemo(() => {
    if (!item || !item.price) return null;
    const price = item.price.slice(1).replaceAll(',', '');
    if (Number.isNaN(price)) return null;
    return Math.round(Number(price) * 1.3).toLocaleString("en-IN", { style: "currency", currency: "INR" });
  }, [item])

  const rating = useMemo(
    () =>
      item ? (Math.random() > 0.5 ? "4.5 (2.0K)" : "4.0 (1.5K)") : null, // Random rating for demo
    [item]
  )

  const productRatings = useMemo(
    () => (
      <span className="inline-flex items-center gap-1">
        {rating && rating.length > 0 && (
          <>
            <CiStar className="inline-block text-[#db2777] text-lg" />
            <p className="inline-block text-xs text-[#db2777] sm:text-sm">
              {rating || "4.5 (2.0K)"}
            </p>
          </>
        )}
      </span>
    ),
    [rating]
  )

  if (!item?.price) {
    return null
  }

  return (
    <Link
      href="#"
      className="h-full min-h-full w-full min-w-full cursor-pointer"
    >
      <Card
        className="w-full max-w-full overflow-hidden"
      >
        <div className="relative aspect-[8/11] w-full max-w-full overflow-hidden">
          {(coverSlide && coverSlide?.reference) ? <Image
            width={300}
            height={300}
            src={coverSlide?.reference}
            alt={coverSlide?.altText ?? "Card example background"}
            className="z-0 h-full max-h-full w-full max-w-full object-contain rounded-lg p-4"
          /> : <div className="z-0 h-full max-h-full w-full max-w-full flex items-center justify-center rounded-lg p-4">
            <Camera className="bg-gray-200 text-gray-900 p-2 rounded-full text-lg" size={54} />
          </div>}
          <h2
            className="absolute inset-0 top-auto flex py-2 font-bold items-center text-left leading-tight max-w-full whitespace-nowrap text-ellipsis"
          >
            {item?.name}
          </h2>
        </div>

        <div className="flex flex-col min-w-full max-w-full flex-wrap py-2.5">
          <h6 className="text-left text-sm font-light">
            {productRatings}
          </h6>
          <div className="flex flex-row items-center">
            <p className="text-sm mr-2 text-black/70">from </p>
            <p className="text-sm mr-2 text-gray-500">
              <span className="line-through ">{strikeThroughPrice}</span>
            </p>
            <span className="font-bold text-dark-1 text-sm text-green-600">
              {item?.price}
            </span>
          </div>
        </div>

        <div className="w-full">
          <WhatsAppButton
            product={item}
            phoneNumber={phoneNumber}
            className="bg-blue-600 text-white hover:bg-blue-700 transition-colors rounded-xl p-3 font-semibold shadow-md hover:shadow-lg"
          />
        </div>
      </Card>
    </Link>
  )
}

export default ShopPage;
