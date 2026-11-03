import { cache } from "react";
import { notFound } from "next/navigation";
import ProductDetails from "@/components/ProductDetails";
import { readPublicCatalogue } from "@/lib/catalogue-store";
import { productDescription } from "@/lib/product-copy";
import { pageMetadata } from "@/lib/seo";
import { productUrl } from "@/lib/product-details";

export const dynamic = "force-dynamic";
const findProduct = cache(async (id: string) => (await readPublicCatalogue()).find(p => p.id === id));
type Props = { params: Promise<{ id: string }> };
export async function generateMetadata({ params }: Props) {
  const product = await findProduct((await params).id);
  if (!product) return { title: "Product not found", robots: { index: false } };
  return pageMetadata(product.name, productDescription(product), productUrl(product));
}
export default async function ProductPage({ params }: Props) {
  const product = await findProduct((await params).id);
  if (!product) notFound();
  return <ProductDetails product={product} />;
}
