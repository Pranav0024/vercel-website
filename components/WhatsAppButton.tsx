import React from "react";

type WhatsAppButtonProps = {
  product: {
    id: string;
    name: string;
    price: string;
    mainImage: string;
    link: string;
  };
  phoneNumber: string;
  className?: string; // allow custom styles
};

export default function WhatsAppButton({
  product,
  phoneNumber,
  className,
}: WhatsAppButtonProps) {
  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=Hi! I'm interested in ${product.name}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-block text-center ${className || "bg-blue-600 text-white hover:bg-blue-700"} transition-colors font-semibold rounded-xl py-3 shadow-md hover:shadow-lg w-full`}
    >
      Buy Now
    </a>
  );
}
