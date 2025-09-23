import React, { useState, useRef } from "react";
import Image from "next/image";
import WhatsAppButton from "./WhatsAppButton";
import { Product } from "@/types/types";


interface ProductShowcaseProps {
  products: Product[];
  columns?: number;
}


// Main showcase component (optional full-grid wrapper)
const ProductShowcase: React.FC<ProductShowcaseProps> = ({ products, columns = 4 }) => {
  return (
    <div className="py-20 px-6 sm:px-10 max-w-screen-2xl mx-auto">
      <h2 className="text-4xl sm:text-5xl font-extrabold text-center text-black mb-10">
        Our Products
      </h2>
      <div
        className={`grid gap-8 ${
          columns === 4
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            : columns === 3
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1 sm:grid-cols-2"
        }`}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductShowcase;

// =======================
// ProductCard: Individual product with carousel, 3D tilt, WhatsApp
// =======================
export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [shadow, setShadow] = useState({ x: 0, y: 0 });

  // 3D tilt effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 15;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -15;
    setRotation({ x, y });
    setShadow({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
    });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setShadow({ x: 0, y: 0 });
  };

  // Carousel: click to next image
  const nextImage = () => setCurrentImage((prev) => (prev + 1) % product.images.length);

  // Fallback for empty images
  const carouselImages = product.images.length > 0 ? product.images : [product.mainImage || "/placeholder1.png"];

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-3xl shadow-xl overflow-hidden p-4 transition-transform duration-300 transform hover:scale-105 cursor-pointer"
      style={{
        transform: `rotateX(${rotation.y}deg) rotateY(${rotation.x}deg)`,
        boxShadow: `${shadow.x}px ${shadow.y}px 40px rgba(255,255,255,0.3)`,
      }}
    >
      {/* Product Image Carousel */}
      <div className="relative w-full h-64 mb-4">
        <Image
          src={carouselImages[currentImage]}
          alt={product.name}
          fill
          className="object-contain rounded-2xl"
        />
        {carouselImages.length > 1 && (
          <button
            onClick={nextImage}
            className="absolute bottom-2 right-2 bg-white/30 backdrop-blur-md px-3 py-1 rounded-full text-blue-600 font-bold hover:bg-white/50 transition-all duration-300"
          >
            Next
          </button>
        )}
      </div>

      {/* Product Info */}
      <h3 className="text-lg font-bold text-blue-600 mb-1">{product.name}</h3>
      <p className="text-white font-semibold mb-2">{product.price}</p>

      {/* WhatsApp Button */}
      <WhatsAppButton product={product} phoneNumber="918123456789" />
    </div>
  );
};
