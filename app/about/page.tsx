import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { ArrowRight, Layers3, Package, Globe2 } from "lucide-react";

export const metadata = pageMetadata("About Our Materials & Sourcing Business", "Learn about Paniar, a dealer in textures, building materials and application tools. Discuss product sourcing, bulk requirements and import-export enquiries.", "/about");

export default function AboutPage() {
  return (
    <main id="main-content" className="subpage page-shell">
      <header className="page-intro">
        <p className="eyebrow">About Paniar</p>
        <h1>Materials with possibility.</h1>
        <p className="intro-copy">
          A dealer for textures and building materials. A point of contact for
          your next project, sourcing conversation or import and export enquiry.
        </p>
      </header>

      <section className="two-column" aria-labelledby="what-we-do">
        <div className="glass-panel">
          <p className="eyebrow">What we do</p>
          <h2 id="what-we-do">Start with the material. Shape the idea.</h2>
          <p className="muted">
            From the character of a textured surface to the materials behind a
            build, every requirement starts with a conversation. Tell us what
            you have in mind so we can discuss the details and next steps.
          </p>
          <Link href="/contact" className="button button-primary">
            Discuss your requirement <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <div className="glass-panel service-list">
          <div>
            <Layers3 aria-hidden="true" />
            <h3>Textures &amp; finishes</h3>
            <p className="muted">
              Explore your ideas for surface character, colour and finish.
            </p>
          </div>
          <div>
            <Package aria-hidden="true" />
            <h3>Building materials</h3>
            <p className="muted">
              Share material specifications and project requirements.
            </p>
          </div>
          <div>
            <Globe2 aria-hidden="true" />
            <h3>Import &amp; export enquiries</h3>
            <p className="muted">
              Start a conversation about sourcing or trade requirements.
            </p>
          </div>
        </div>
      </section>

      <section className="glass-panel" aria-labelledby="how-to-begin">
        <p className="eyebrow">A clear starting point</p>
        <h2 id="how-to-begin">Your idea, in a little more detail.</h2>
        <div className="process-row">
          <span aria-hidden="true">01</span>
          <div>
            <h3>Tell us what you need</h3>
            <p className="muted">
              Describe the material, finish or enquiry you want to discuss.
            </p>
          </div>
        </div>
        <div className="process-row">
          <span aria-hidden="true">02</span>
          <div>
            <h3>Share the context</h3>
            <p className="muted">
              Include specifications, quantities and timelines where you know
              them.
            </p>
          </div>
        </div>
        <div className="process-row">
          <span aria-hidden="true">03</span>
          <div>
            <h3>Continue the conversation</h3>
            <p className="muted">
              Connect directly with Paniar to discuss your enquiry.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
