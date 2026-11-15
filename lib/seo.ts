import type { Metadata } from "next";

export const SITE_URL = "https://www.paniar.in";
export const SITE_DESCRIPTION = "Shop pneumatic texture spray guns, wall texture tools, mandala stencils and building materials at Paniar. Contact our Ludhiana team for prices and orders.";
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
