// types.ts
export interface Product {
  id: string;
  name: string;
  price: string;
  mainImage: string; // optional
  link?: string;      // optional, for future use
  images?: string[];  // optional, for carousel
}
