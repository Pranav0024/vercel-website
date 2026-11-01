import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Catalogue: Texture Tools, Sprayers & Products", "Browse texture spray guns, stucco trowels, texture brushes, mandala stencils, garden sprayers and thank-you cards. Ask Paniar for availability and bulk quotations.", "/shop");

export default function CatalogueLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
