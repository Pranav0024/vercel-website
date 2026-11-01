import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";
export default function EnquiryBanner() {
  return (
    <section className="page-shell enquiry-wrap">
      <div className="enquiry-banner glass-panel">
        <div>
          <span className="eyebrow">LET’S FIND WHAT’S NEXT</span>
          <h2>
            Your next project.
            <br />
            Our next conversation.
          </h2>
          <p>
            A material, a product or an idea. Tell us what you have in mind.
          </p>
        </div>
        <div className="enquiry-actions">
          <Link href="/contact" className="button button-primary">
            Share your requirement <ArrowUpRight size={18} />
          </Link>
          <a
            className="button button-glass"
            href="https://wa.me/918968310500?text=Hello%20Paniar%2C%20I%27d%20like%20to%20discuss%20a%20requirement."
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={18} /> Let’s talk on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
