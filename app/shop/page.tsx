"use client";

export const dynamic = "force-dynamic";

import React, { PropsWithChildren } from "react";
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {products.map((product) => (
              // <AltProductCard key={product.id} product={product} phoneNumber={phoneNumber} />
              <ProductCard key={product.id} item={product} phoneNumber={phoneNumber} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const AltProductCard = ({ product, phoneNumber }: { product: Product, phoneNumber: string }) => {

  return <div
    key={product.id}
    className="relative bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl shadow-lg p-6 flex flex-col items-center text-center transition-transform duration-500 hover:scale-105 hover:shadow-2xl"
  >
    <div className="relative w-full h-64 mb-6 rounded-2xl overflow-hidden">
      {product.mainImage && <Image
        src={product.mainImage}
        alt={product.name}
        fill
        className="object-cover transition-transform duration-500 hover:scale-105"
      />}
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
}

import { useMemo } from "react"
import { twMerge } from "tailwind-merge"
import { Product } from "@/types/types";
import Link from "next/link";
import { CiStar } from "react-icons/ci";
import { Camera } from "lucide-react";
// UI
// import { Card, Image, Link } from "@nextui-org/react"
// Custom Components
// import ResponsiveHeading from "../typography/ResponsiveHeading"
// import Heading from "../typography/Heading"
// Utilities
// import { getProductThumbnailImage } from "@/utils/media-filter"
// Services
// import { getProduct_ID_URL } from "@/utils/slugs"
// import { getMetaFieldsContent } from "@/service/content.service"
// Constants/Config
// import * as CONFIG from "@/constants"
// Type definition
// import { Product, MediaSlide, City, FilteredProduct } from "@/types"

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
    // Format to get the number for price
    const price = item.price.slice(1).replaceAll(',', '');
    // Check and return
    if (Number.isNaN(price)) return null;
    return Math.round(Number(price) * 1.3).toLocaleString("en-IN", { style: "currency", currency: "INR" });
  }, [item])

  // Get the rating fields from the product
  const rating = useMemo(
    () =>
      // getMetaFieldsContent(
      //   item?.productMeta?.metaFields ?? null,
      //   "ratings",
      //   null
      // ) as string,
      Math.random() > 0.5 ? "4.5 (2.0K)" : "4.0 (1.5K)", // Random rating for demo
    [item]
  )

  const productRatings = useMemo(
    () => (
      <span className="inline-flex items-center gap-1">
        {rating && rating.length > 0 && (
          <>
            <CiStar className="inline-block text-[#db2777] text-lg" />
            {/* <i className="icon-star inline-block text-xs text-[#db2777] sm:text-sm" /> */}
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
      // href={getProduct_ID_URL(
      //   item?.productMeta.cityMeta as City,
      //   item?.productMeta as FilteredProduct
      // )}
      href="#"
      className="h-full min-h-full w-full min-w-full cursor-pointer"
    >
      <Card
        // shadow="none"
        // radius="md"
        // isPressable
        className="w-full max-w-full overflow-hidden"
      >
        {/* Image and the title */}
        <div className="relative aspect-[8/11] w-full max-w-full overflow-hidden">
          {(coverSlide && coverSlide?.reference) ? <Image
            width={300}
            height={300}
            src={coverSlide?.reference}
            alt={coverSlide?.altText ?? "Card example background"}
            className="z-0 h-full max-h-full w-full max-w-full object-contain rounded-lg p-4"
          /> : <div className="z-0 h-full max-h-full w-full max-w-full flex items-center justify-center rounded-lg p-4">
            {/* <span className="text-gray-500">No Image</span> */}
            <Camera className="bg-gray-200 text-gray-900 p-2 rounded-full text-lg" size={54} />
          </div>}
          {/* The descriptor goes here */}
          {/* <Descriptor descriptors={item?.productMeta.descriptors || []} /> */}
          {/* The title goes here */}
          <h2
            className="absolute inset-0 top-auto flex py-2 font-bold items-center text-left leading-tight max-w-full whitespace-nowrap text-ellipsis"
          >
            {item?.name}
          </h2>
        </div>

        {/* Descriptors */}
        <div className="flex flex-col min-w-full max-w-full flex-wrap py-2.5">
          <h6 className="text-left text-sm font-light">
            {productRatings}
          </h6>
          <div className="flex flex-row items-center">
            <p className="text-sm mr-2 text-black/70">from </p>
            {/* Strike through price, before discount */}
            <p className="text-sm mr-2 text-gray-500">
              <span className="line-through ">{strikeThroughPrice}</span>
            </p>
            <span className="font-bold text-dark-1 text-sm text-green-600">
              {item?.price}
            </span>
            {/* <p className="bg-success chevron-clip-left mx-2 ml-2 rounded-md px-2 py-1 pl-4 pr-2 text-center text-xs font-medium text-white">
              37% off
            </p> */}
          </div>
        </div>

        {/* Bu now button */}
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

// const Descriptor = ({
//   descriptors,
//   iconSize = 16,
// }: {
//   descriptors: string[]
//   iconSize?: number
// }) => {
//   // Function to format descriptors
//   const descriptorFormat = (descriptor: string): string => {
//     return descriptor
//       .toLowerCase()
//       .replace(/_/g, " ")
//       .replace(/\b\w/g, char => char.toUpperCase())
//   }

//   // Function to find the icon for a given descriptor
//   const getIconForDescriptor = (descriptor: string): string => {
//     const match = CONFIG.ASSETS.DESC_ICONS.find(
//       d => d.desc === descriptor.toUpperCase()
//     )
//     return match ? match.icon : "/img/icons/open.png"
//   }

//   const descriptorItem = useMemo(
//     () =>
//       descriptors.length > 0
//         ? descriptors[
//         Math.max(0, Math.floor(Math.random() * descriptors.length - 1))
//         ]
//         : null,
//     [descriptors]
//   )

//   return (
//     descriptorItem && (
//       <div
//         className={twMerge(
//           "absolute left-0 top-6 z-40 inline-flex -translate-y-1/4 items-center justify-between gap-2 rounded-r-md bg-green-0 px-2 py-1 text-[12px] text-white"
//         )}
//       >
//         <Image
//           src={getIconForDescriptor(descriptorItem).toLowerCase()}
//           className={w - [${ iconSize }px] inline-block aspect-square min-h-0 min-w-0 text-white grayscale}
//         shadow="none"
//         radius="none"
//         width={iconSize}
//         height={iconSize}
//         alt={"descriptor-" + descriptorItem}
//         />
//         <div className="mt-1 text-[12px] leading-normal">
//           {descriptorFormat(descriptorItem)}
//         </div>
//       </div>
//     )
//   )
// }


export default ShopPage;
