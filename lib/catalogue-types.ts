export const CATEGORIES = [
  "Textures & finishes",
  "Building materials",
  "Tools & application",
  "General products",
  "Imports & exports",
] as const;
export type CatalogueProduct = {
  id: string;
  name: string;
  price: string;
  mainImage: string;
  category: string;
  description: string;
  published: boolean;
  featured: boolean;
};
export type PublicProduct = Omit<CatalogueProduct, "price" | "published">;
export type CatalogueDocument = {
  version: 1;
  products: CatalogueProduct[];
  publishedProducts: CatalogueProduct[];
  publishedAt: string | null;
};
