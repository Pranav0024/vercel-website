import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product catalogue",
  description:
    "Browse Paniar’s application tools and products. Discuss availability, specifications and quotations, or share a sourcing requirement.",
};

export default function CatalogueLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
