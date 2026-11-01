import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ArrowUpRight, Layers3, MoveUpRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="hero page-shell" aria-labelledby="hero-title">
      <div className="hero-copy">
        <span className="eyebrow">
          <span className="status-dot" /> MATERIALS. SOURCING. POSSIBILITIES.
        </span>
        <h1 id="hero-title">
          A world of
          <br />
          <span className="blue-type">materials.</span>
          <br />
          Made possible.
        </h1>
        <p>
          From the texture of a wall to the possibilities of global trade. We
          bring materials, products and sourcing together, under one name.
        </p>
        <div className="hero-actions">
          <Link href="/#expertise" className="button button-primary">
            Explore our world <ArrowUpRight size={18} />
          </Link>
          <Link href="/contact" className="button button-glass">
            Discuss a requirement <ArrowUpRight size={18} />
          </Link>
        </div>
        <a href="#expertise" className="hero-scroll">
          <span className="glass-icon">
            <ArrowDown size={17} />
          </span>{" "}
          A different perspective on supply
        </a>
      </div>
      <div className="hero-visual">
        <div className="hero-photo">
          <Image
            src="/images/materials-interior.jpg"
            alt="Contemporary interior combining textured stone, timber and architectural finishes"
            fill
            priority
            sizes="(max-width: 760px) 100vw, 50vw"
          />
          <div className="hero-photo-tag glass-panel">
            <span className="status-dot" /> Thoughtfully sourced. Beautifully
            considered.
          </div>
          <div className="hero-photo-caption">
            <span>THE MATERIAL PERSPECTIVE</span>
            <p>
              Great spaces start
              <br />
              with the right choices.
            </p>
            <MoveUpRight size={28} />
          </div>
        </div>
        <div className="material-note glass-panel">
          <span className="note-icon glass-icon">
            <Layers3 size={22} />
          </span>
          <div>
            <span className="eyebrow">DETAILS MAKE THE DIFFERENCE</span>
            <strong>Every surface. A possibility.</strong>
            <span className="muted">
              Textures · Finishes · Building materials
            </span>
          </div>
          <div className="mini-swatches" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
        </div>
        <span className="hero-coordinate">PANIAR / A MATERIAL WORLD</span>
      </div>
    </section>
  );
}
