import { productUrl } from "@/lib/product-details";
import CatalogueBrowser from "@/components/CatalogueBrowser";
import { readPublicCatalogue } from "@/lib/catalogue-store";
import { SITE_URL, jsonLd } from "@/lib/seo";
import { productSlides } from "@/lib/product-imagery";
import { productDescription } from "@/lib/product-copy";
export const dynamic = "force-dynamic";
export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string | string[] }>;
}) {
  const [products, params] = await Promise.all([
    readPublicCatalogue(),
    searchParams,
  ]);
  const initialSearch = Array.isArray(params.search)
    ? params.search[0] || ""
    : params.search || "";
  const listed = products.filter(product => product.name.toLowerCase().includes(initialSearch.trim().toLowerCase()));
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({
      "@context": "https://schema.org", "@type": "CollectionPage", name: "Paniar product catalogue", url: `${SITE_URL}/shop`,
      mainEntity: { "@type": "ItemList", numberOfItems: listed.length, itemListElement: listed.map((product, index) => ({
        "@type": "ListItem", position: index + 1, item: {
          "@type": "Thing", name: product.name.trim(), description: productDescription(product),
          url: `${SITE_URL}${productUrl(product)}`,
          image: new URL(productSlides(product.mainImage)[0]?.src || product.mainImage, SITE_URL).href,
        },
      })) },
    }) }} />
    <CatalogueBrowser products={products} initialSearch={initialSearch} />
  </>;
}
