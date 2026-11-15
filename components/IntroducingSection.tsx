import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Package, Layers3, PackageSearch } from "lucide-react";

export default function IntroducingSection() {
  return (
    <section
      id="expertise"
      className="expertise-section page-shell section-space"
    >
      <div className="section-heading">
        <div>
          <span className="eyebrow">ONE NAME. MANY POSSIBILITIES.</span>
          <h2>
            Different needs.
            <br />
            <span className="blue-type">Connected by Paniar.</span>
          </h2>
        </div>
        <p>
          For the spaces you create, the projects you build and the products
          your business needs.
        </p>
      </div>
      <div className="division-grid">
        <Link
          href="/contact?interest=Textures"
          className="division-card glass-panel division-featured"
        >
          <div className="division-art texture-art">
            <Image
              src="/images/interior-detail.jpg"
              alt="Natural finishes and tactile materials in a contemporary living space"
              fill
              sizes="(max-width: 760px) 100vw, 45vw"
            />
            <span className="division-index glass-panel">01 / SURFACES</span>
            <span className="glass-icon card-arrow">
              <ArrowUpRight size={20} />
            </span>
          </div>
          <div className="division-copy">
            <Layers3 size={22} />
            <h3>Textures & finishes</h3>
            <p>
              Bring depth and character to your spaces. Let’s find the right
              finish for your vision.
            </p>
            <span className="text-link">
              Explore the possibilities <ArrowUpRight size={16} />
            </span>
          </div>
        </Link>
        <Link
          href="/contact?interest=Building%20materials"
          className="division-card glass-panel"
        >
          <div className="division-art materials-art" aria-hidden="true">
            <span className="division-index glass-panel">02 / FOUNDATIONS</span>
            <div className="material-slab slab-one" />
            <div className="material-slab slab-two" />
            <div className="material-slab slab-three" />
            <span className="glass-icon card-arrow">
              <ArrowUpRight size={20} />
            </span>
          </div>
          <div className="division-copy">
            <PackageSearch size={22} />
            <h3>Building materials</h3>
            <p>
              Material enquiries, project requirements and application tools.
              All in one conversation.
            </p>
            <span className="text-link">
              Tell us what you need <ArrowUpRight size={16} />
            </span>
          </div>
        </Link>
        <Link
          href="/shop"
          className="division-card glass-panel"
        >
          <div className="division-art trade-art" aria-hidden="true">
            <span className="division-index glass-panel">03 / PRODUCTS</span>
            <div className="globe-orbit">
              <Package strokeWidth={0.65} />
            </div>
            <span className="orbit-dot" />
            <span className="trade-art-label">TOOLS FOR YOUR NEXT PROJECT</span>
            <span className="glass-icon card-arrow">
              <ArrowUpRight size={20} />
            </span>
          </div>
          <div className="division-copy">
            <Package size={22} />
            <h3>Tools & stencils</h3>
            <p>
              Explore texture spray guns, application brushes and mandala stencils for your next project.
            </p>
            <span className="text-link">
              Browse products <ArrowUpRight size={16} />
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
