"use client";

import React, { useEffect, useState } from "react";
import { Product } from "@/types/types"; // or "../types/types"
import ProductShowcase from "./productshowcase";


interface ProductGridProps {
  apiEndpoint?: string;          // optional, default fetch URL
  limit?: number;                // number of products to fetch/show
  products?: Product[] | null;   // optional, can be passed from parent
  loading?: boolean;             // optional, can be passed from parent
  columns?: number;              // optional, default 4
}

const ProductGrid: React.FC<ProductGridProps> = ({
  apiEndpoint = "/api/product",
  limit = 8,
  products: initialProducts,
  loading: initialLoading,
  columns = 4,
}) => {
  const [products, setProducts] = useState<Product[] | null>(initialProducts || null);
  const [loading, setLoading] = useState(initialLoading ?? true);

  useEffect(() => {
    if (initialProducts) return; // if parent passed products, skip fetch

    const fetchProducts = async () => {
      try {
        const res = await fetch(`${apiEndpoint}?limit=${limit}`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [apiEndpoint, limit, initialProducts]);

  const shimmerPlaceholders = Array.from({ length: limit });

  return (
    <div
      className={`grid gap-8 ${
        columns === 4
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          : columns === 3
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-1 sm:grid-cols-2"
      }`}
    >
      {(loading || !products || products.length === 0)
        ? shimmerPlaceholders.map((_, idx) => (
            <div
              key={idx}
              className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-3xl shadow-xl overflow-hidden animate-pulse"
            >
              <div className="w-full h-64 rounded-2xl mb-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full animate-ping-slow bg-white/20 rounded-2xl" />
              </div>
              <div className="h-6 bg-white/10 rounded mb-2 mx-4 mt-2" />
              <div className="h-5 bg-white/10 rounded mx-4" />
              <div className="h-10 bg-white/10 rounded mx-4 mt-4" />
            </div>
          ))
        : products.map((product) => (
            <ProductShowcase key={product.id} product={product} phoneNumber="918360746541"/>
          ))}
    </div>
  );
};

export default ProductGrid;
