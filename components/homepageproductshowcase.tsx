import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import products from "@/data/products";

export default function HomepageProductShowcase() {
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
        {products.slice(0, 4).map((product, index) => (
          <Link
            className="product-preview glass-panel"
            key={product.id}
            href={"/shop?search=" + encodeURIComponent(product.name.trim())}
          >
            <div className="preview-image">
              <span className="product-number">0{index + 1}</span>
              <Image
                src={product.mainImage!}
                alt={product.name.trim()}
                fill
                sizes="(max-width: 600px) 50vw, 25vw"
              />
              <span className="glass-icon">
                <ArrowUpRight size={18} />
              </span>
            </div>
            <div className="preview-info">
              <span className="eyebrow">TOOLS & APPLICATION</span>
              <h3>
                {product.name
                  .trim()
                  .toLowerCase()
                  .replace(/(^|\s)\S/g, (c) => c.toUpperCase())}
              </h3>
              <span className="muted">Product enquiries welcome</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
