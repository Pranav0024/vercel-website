export const CATEGORIES = [
  "Textures & finishes",
  "Building materials",
  "Tools & application",
  "General products",
  "Imports & exports",
] as const;
export type ProductVariation = { id: string; name: string; size: string; price: string; mainImage: string };
export type CatalogueProduct = {
  id: string;
  name: string;
  price: string;
  mainImage: string;
  category: string;
  description: string;
  published: boolean;
  featured: boolean;
  rank?: number;
  variations?: ProductVariation[];
};
export type PublicProduct = Omit<CatalogueProduct, "published">;

// Equal or unset ranks retain their saved order; never mutate the stored array.
export function orderProducts<T extends { rank?: number }>(products: readonly T[]): T[] {
  return [...products].sort((a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity));
}
export type CatalogueDocument = {
  version: 1;
  products: CatalogueProduct[];
  publishedProducts: CatalogueProduct[];
  publishedAt: string | null;
};
