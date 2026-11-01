import { readPublicCatalogue } from "@/lib/catalogue-store";
import Hero from "@/components/Hero";
import IntroducingSection from "@/components/IntroducingSection";
import HomepageProductShowcase from "@/components/homepageproductshowcase";
import EnquiryBanner from "@/components/EnquiryBanner";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Layers3,
  PackageSearch,
  Globe2,
  MoveRight,
} from "lucide-react";

export const dynamic = "force-dynamic";
export default async function Home() {
  const catalogue = await readPublicCatalogue();
  return (
    <main id="main-content">
      <Hero />
      <div className="capability-strip page-shell">
        <span>
          YOUR REQUIREMENT.
          <br />
          <strong>OUR STARTING POINT.</strong>
        </span>
        <div>
          <Layers3 size={20} /> Textures & finishes
        </div>
        <div>
          <PackageSearch size={20} /> Building materials
        </div>
        <div>
          <Globe2 size={20} /> Imports & exports
        </div>
        <span className="strip-end">
          A broader perspective <ArrowUpRight size={17} />
        </span>
      </div>
      <IntroducingSection />
      <section className="perspective-section page-shell section-space">
        <div className="perspective-image">
          <Image
            src="/images/interior-detail.jpg"
            alt="A calm interior with natural stone, soft textures and warm timber finishes"
            fill
            sizes="(max-width: 760px) 100vw, 45vw"
          />
          <span className="image-footnote glass-panel">
            A considered approach. Down to the detail.
          </span>
        </div>
        <div className="perspective-copy">
          <span className="eyebrow">MORE THAN A PRODUCT CATALOGUE</span>
          <h2>
            One conversation.
            <br />
            <span className="blue-type">A wider perspective.</span>
          </h2>
          <p>
            Every requirement starts somewhere. A finish you’ve imagined. A
            material your project needs. A product you’re trying to find.
          </p>
          <p>
            Paniar brings these conversations together—across textures, building
            materials, texture spray guns, stucco trowels, application brushes
            and general product sourcing.
          </p>
          <Link href="/about" className="text-link">
            Get to know Paniar <ArrowUpRight size={17} />
          </Link>
          <div className="perspective-tags">
            <span className="glass-panel">For projects</span>
            <span className="glass-panel">For businesses</span>
            <span className="glass-panel">For possibilities</span>
          </div>
        </div>
      </section>
      <HomepageProductShowcase products={catalogue} />
      <section className="process-section page-shell section-space">
        <div className="process-header">
          <span className="eyebrow">FROM A REQUIREMENT TO A WAY FORWARD</span>
          <h2>
            Let’s make it happen.
            <br />
            <span className="blue-type">One step at a time.</span>
          </h2>
        </div>
        <div className="process-grid">
          {[
            {
              n: "01",
              title: "Tell us what you need",
              text: "Share the product, finish, quantity or project brief you have in mind.",
            },
            {
              n: "02",
              title: "Explore the possibilities",
              text: "Discuss options, specifications and sourcing requirements with us.",
            },
            {
              n: "03",
              title: "Plan the next step",
              text: "Confirm availability, pricing and supply details for your requirement.",
            },
          ].map((step) => (
            <div className="process-card glass-panel" key={step.n}>
              <span className="process-number">{step.n}</span>
              <MoveRight size={23} />
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </section>
      <EnquiryBanner />
    </main>
  );
}
