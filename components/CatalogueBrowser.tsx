"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Search, SlidersHorizontal, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CATEGORIES, type PublicProduct } from "@/lib/catalogue-types";
import EnquiryBanner from "@/components/EnquiryBanner";

const categories = ["All products", ...CATEGORIES];
function Catalogue({
  initialSearch,
  products,
}: {
  initialSearch: string;
  products: PublicProduct[];
}) {
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(categories[0]);
  const filtered = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search.trim().toLowerCase()) &&
      (category === categories[0] || product.category === category),
  );
  return (
    <>
      <section className="page-shell subpage catalogue-page">
        <div className="page-intro">
          <span className="eyebrow">EXPLORE THE POSSIBILITIES</span>
          <h1>
            Our catalogue.
            <br />
            <span className="blue-type">Your next starting point.</span>
          </h1>
          <p className="intro-copy">
            Browse a selection of our tools and products. For textures, building
            materials, bulk quantities or sourcing enquiries, let’s discuss your
            requirement.
          </p>
        </div>
        <div className="catalogue-toolbar glass-panel">
          <div
            className="category-tabs"
            role="group"
            aria-label="Product categories"
          >
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={category === c}
                className={category === c ? "active" : ""}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <label className="catalogue-search">
            <Search size={18} />
            <span className="sr-only">Search products</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Find a product…"
            />
            {search && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearch("")}
              >
                <X size={16} />
              </button>
            )}
          </label>
        </div>
        <div className="catalogue-summary">
          <span>
            {filtered.length} product{filtered.length !== 1 ? "s" : ""}
          </span>
          <span>
            <SlidersHorizontal size={14} /> Availability & quotations on enquiry
          </span>
        </div>
        {filtered.length ? (
          <div className="catalogue-grid">
            {filtered.map((product, index) => (
              <article
                className="catalogue-card glass-panel"
                key={product.id + product.name}
              >
                <div className="catalogue-image">
                  <span className="product-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {product.mainImage && (
                    <Image
                      src={product.mainImage}
                      alt={product.name.trim()}
                      fill
                      sizes="(max-width: 540px) 90vw, (max-width: 950px) 45vw, 30vw"
                    />
                  )}
                </div>
                <div className="catalogue-card-info">
                  <span className="eyebrow">{product.category}</span>
                  <h2>{product.name.trim()}</h2>
                  <p>
                    {product.description ||
                      "Discuss specifications, quantities and availability."}
                  </p>
                  <a
                    className="button button-glass"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={
                      "https://wa.me/918968310500?text=" +
                      encodeURIComponent(
                        "Hello Paniar, I’d like to enquire about " +
                          product.name.trim() +
                          " (Reference " +
                          product.id +
                          "). Catalogue design: " +
                          (product.mainImage
                            ?.split("/")
                            .pop()
                            ?.replace(/\.[^.]+$/, "") || product.name.trim()) +
                          ". Please share availability and quotation details.",
                      )
                    }
                  >
                    Enquire about this product <ArrowUpRight size={17} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state glass-panel">
            <Search size={30} />
            <h2>No matching products</h2>
            <p>Try another search, or tell us what you’re looking for.</p>
            <button
              className="button button-glass"
              type="button"
              onClick={() => {
                setSearch("");
                setCategory(categories[0]);
              }}
            >
              Reset filters
            </button>
            <Link className="text-link" href="/contact">
              Ask about a product <ArrowUpRight size={16} />
            </Link>
          </div>
        )}
        <p className="catalogue-note">
          Looking for something beyond this selection?{" "}
          <Link href="/contact">
            Share your sourcing requirement <ArrowUpRight size={15} />
          </Link>
        </p>
      </section>
      <EnquiryBanner />
    </>
  );
}
function CatalogueRoute({ products }: { products: PublicProduct[] }) {
  const params = useSearchParams();
  const initialSearch = params.get("search") || "";
  return (
    <Catalogue
      key={initialSearch}
      initialSearch={initialSearch}
      products={products}
    />
  );
}
export default function CatalogueBrowser({
  products,
}: {
  products: PublicProduct[];
}) {
  return (
    <main id="main-content">
      <Suspense
        fallback={
          <div className="page-shell subpage">
            <p>Loading catalogue…</p>
          </div>
        }
      >
        <CatalogueRoute products={products} />
      </Suspense>
    </main>
  );
}
