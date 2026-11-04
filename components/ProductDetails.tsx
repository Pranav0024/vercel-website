"use client";
import { useState } from "react";
import Link from "next/link";
import ProductGallery from "./ProductGallery";
import type { PublicProduct } from "@/lib/catalogue-types";
import { formatPrice } from "@/lib/product-details";
import { productDescription } from "@/lib/product-copy";

export default function ProductDetails({ product }: { product: PublicProduct }) {
  const variations = product.variations ?? [];
  const [selected, setSelected] = useState(variations[0]?.id ?? "");
  const [search, setSearch] = useState("");
  const variation = variations.find(v => v.id === selected);
  const image = variation?.mainImage || product.mainImage;
  const options = variations.filter(v => `${v.name} ${v.size}`.toLowerCase().includes(search.toLowerCase()));
  const message = `Hello Paniar, I’d like to enquire about ${product.name} (${product.id})${variation ? `, variation ${variation.name} (${variation.id}), size: ${variation.size || "please confirm"}` : ""}. Please confirm availability, taxes, delivery and final quotation.`;
  return <main id="main-content" className="page-shell subpage product-page">
    <Link href="/shop" className="text-link">← Back to catalogue</Link>
    <div className="product-detail-grid">
      <div className="glass-panel product-detail-photo"><ProductGallery key={image} mainImage={image} name={variation ? `${product.name} — ${variation.name}` : product.name} number={1} /></div>
      <section className="glass-panel product-detail-copy">
        <span className="eyebrow">{product.category}</span><h1>{product.name}</h1>
        <p className="product-price" aria-live="polite">{formatPrice(variation?.price || product.price)}</p>
        <p>{productDescription(product)}</p>
        {variations.length > 0 && <fieldset className="product-options"><legend>Choose a variation · {variations.length} options</legend>
          <label htmlFor="variation-search">Find a design or size</label><input id="variation-search" type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search variations…" />
          <label htmlFor="variation-choice">Design / size</label><select id="variation-choice" value={selected} onChange={e => setSelected(e.target.value)}>
            {variation && !options.some(v => v.id === selected) && <option value={variation.id}>{variation.name} {variation.size}</option>}
            {options.map(v => <option key={v.id} value={v.id}>{v.name}{v.size ? ` · ${v.size}` : ""}</option>)}
          </select>
          {!options.length && <p role="status">No matching variations. Try another design or size.</p>}
          {variation && <p>Selected: <strong>{variation.name}</strong>{variation.size ? ` · ${variation.size}` : ""}{!variation.mainImage ? " · Product reference photo shown" : ""}</p>}
        </fieldset>}
        <a className="button button-primary" href={`https://wa.me/918968310500?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer">Enquire about {variation ? "this variation" : "this product"} ↗</a>
        <p className="muted">Reference: {product.id}. Confirm availability, applicable taxes and delivery charges before ordering.</p>
      </section>
    </div>
  </main>;
}

