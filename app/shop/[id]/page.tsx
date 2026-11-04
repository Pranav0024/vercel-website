import { cache } from "react";
import { notFound } from "next/navigation";
import ProductDetails from "@/components/ProductDetails";
import { readPublicCatalogue } from "@/lib/catalogue-store";
import { productDescription } from "@/lib/product-copy";
import { pageMetadata, jsonLd, SITE_URL } from "@/lib/seo";
import { productUrl, displayPrice } from "@/lib/product-details";

export const dynamic = "force-dynamic";
const findProduct = cache(async (id: string) => (await readPublicCatalogue()).find(p => p.id === id));
type Props = { params: Promise<{ id: string }> };
export async function generateMetadata({ params }: Props) {
  const product = await findProduct((await params).id);
  if (!product) return { title: "Product not found", robots: { index: false } };
  const description = displayPrice(product) + ". " + productDescription(product);
  const metadata = pageMetadata(product.name, description, productUrl(product));
  const images = [new URL(product.mainImage, SITE_URL).href];
  return { ...metadata, openGraph: { ...metadata.openGraph, images }, twitter: { ...metadata.twitter, images } };
}
export default async function ProductPage({ params }: Props) {
  const product = await findProduct((await params).id);
  if (!product) notFound();
  const url = SITE_URL + productUrl(product);
  const variants = product.variations ?? [];
  const options = variants.length ? variants.map(v => ({name: v.name, price: v.price || product.price})) : [{name: product.name, price: product.price}];
  const offers = options.flatMap(option => {
    const match = /^₹?\s*(\d[\d,]*(?:\.\d+)?)\s*₹?(?:\s+per (square inch))?$/i.exec(option.price.trim());
    if (!match) return [];
    const price = match[1].replaceAll(",", "");
    return [{"@type":"Offer", name: option.name, url, ...(match[2] ? {priceSpecification: {"@type":"UnitPriceSpecification", price, priceCurrency:"INR", referenceQuantity: {"@type":"QuantitativeValue",value:1,unitText:"square inch"}}} : {price,priceCurrency:"INR"})}];
  });
  const schema = {"@context":"https://schema.org","@type":"Product",name:product.name,description:productDescription(product),sku:product.id,url,image:new URL(product.mainImage,SITE_URL).href,...(offers.length ? {offers} : {})};
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(schema)}} /><ProductDetails product={product} /></>;
}
