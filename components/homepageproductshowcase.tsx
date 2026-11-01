import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { PublicProduct } from "@/lib/catalogue-types";
import { productSlides } from "@/lib/product-imagery";

export default function HomepageProductShowcase({
  products,
}: {
  products: PublicProduct[];
}) {
  const featured = products.filter((product) => product.featured);
  const items = (featured.length ? featured : products).slice(0, 4);
  if (!items.length) return null;
  return (
    <section className="catalogue-preview section-space page-shell">
      <div className="section-heading">
        <div>
          <span className="eyebrow">THE RIGHT TOOLS FOR THE DETAIL</span>
          <h2>
            A closer look
            <br />
            at our catalogue.
          </h2>
        </div>
        <div>
          <p>
            A selection of application tools and products. For something
            specific, just ask.
          </p>
          <Link href="/shop" className="text-link">
            View the catalogue <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>
      <div className="preview-grid">
        {items.map((product, index) => {
          const image = productSlides(product.mainImage)[0];
          return (
          <Link
            className="product-preview glass-panel"
            key={product.id}
            href={"/shop?search=" + encodeURIComponent(product.name.trim())}
          >
            <div className={`preview-image${image?.generated ? " preview-image-styled" : ""}`}>
              <span className="product-number">0{index + 1}</span>
              <Image
                src={image?.src || product.mainImage}
                alt={`${product.name.trim()}${image?.generated ? " — AI-styled scene" : ""}`}
                fill
                sizes="(max-width: 600px) 50vw, 25vw"
              />
              {image?.generated && <span className="preview-scene-label">AI-styled scene</span>}
              <span className="glass-icon">
                <ArrowUpRight size={18} />
              </span>
            </div>
            <div className="preview-info">
                <span className="eyebrow">{product.category}</span>
              <h3>
                {product.name
                  .trim()
                  .toLowerCase()
                  .replace(/(^|\s)\S/g, (c) => c.toUpperCase())}
              </h3>
              <span className="muted">Product enquiries welcome</span>
            </div>
          </Link>
          );
        })}
      </div>
    </section>
  );
}
