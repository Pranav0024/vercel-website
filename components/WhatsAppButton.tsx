// /components/WhatsAppButton.tsx
"use client";

import React from "react";
import { Product } from "@/types/types";

export type WhatsAppButtonProps = {
  product: Product;
  phoneNumber: string;
  className?: string;
  label?: string;
};

export default function WhatsAppButton({
  product,
  phoneNumber,
  className,
  label = "Buy Now",
}: WhatsAppButtonProps) {
  const text = encodeURIComponent(`Hi! I'm interested in ${product.name} (${product.id})`);
  const href = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, "")}?text=${text}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${className ?? "inline-block"} w-full text-center`}
    >
      {label}
    </a>
  );
}
