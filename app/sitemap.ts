import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

import { readPublicCatalogue } from "@/lib/catalogue-store";
import { productUrl } from "@/lib/product-details";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await readPublicCatalogue();
  return ["/", "/shop", "/about", "/contact", ...products.map(productUrl)].map(path => ({
    url: `${SITE_URL}${path}`,
  }));
}
