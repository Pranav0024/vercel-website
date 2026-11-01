import type { Metadata } from "next";

export const SITE_URL = "https://www.paniar.in";
export const SITE_DESCRIPTION = "Paniar deals in textures and finishes, building materials, application tools and product sourcing. Contact us for bulk supply and import-export enquiries.";
const images = [{ url: "/images/materials-interior.jpg", alt: "Textures, architectural finishes and building materials from Paniar" }];

export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: `${title} | Paniar`, description, url: path, siteName: "Paniar", locale: "en_IN", type: "website", images },
    twitter: { card: "summary_large_image", title: `${title} | Paniar`, description, images },
  };
}

export function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
