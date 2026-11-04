"use client";

import Link from "next/link";
import { Suspense, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowUpRight, Mail, MessageCircle, Phone } from "lucide-react";

function ContactEnquiry() {
  const [notice, setNotice] = useState("");
  const params = useSearchParams();
  const interestMap: Record<string, string> = {
    dealer: "Dealer enquiry",
    Textures: "Textures & finishes",
    "Building materials": "Building materials",
    "Imports & exports": "Import & export",
  };
  const selectedInterest =
    interestMap[params.get("interest") || ""] || "General enquiry";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const interest = String(data.get("interest") ?? "General enquiry");
    const requirement = String(data.get("requirement") ?? "").trim();
    if (!name || !requirement) {
      setNotice("Please enter your name and describe your requirement.");
      return;
    }
    const message = [
      "Hello Paniar, I would like to make an enquiry.",
      `Name: ${name}`,
      ...(email ? [`Email: ${email}`] : []),
      `Interest: ${interest}`,
      "",
      `Requirement: ${requirement}`,
    ].join("\n");
    window.open(
      `https://wa.me/918968310500?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
    setNotice(
      "WhatsApp opens in a new tab with your enquiry ready to review. Press Send in WhatsApp to send it. If no tab opens, please allow pop-ups or use the direct WhatsApp link.",
    );
  }

  return (
    <main id="main-content" className="subpage page-shell">
      <header className="page-intro">
        <p className="eyebrow">Contact Paniar</p>
        <h1>Let’s talk materials.</h1>
        <p className="intro-copy">
          Contact our Ludhiana sales team for texture tools, stencils and building materials. For dealer pricing, share your business name, city and quantities.
        </p>
      </header>

      <div className="two-column">
        <section className="glass-panel" aria-labelledby="enquiry-title">
          <h2 id="enquiry-title">Make an enquiry</h2>
          <p className="muted" id="form-help">
            Required fields are marked *. This form opens WhatsApp in a new tab;
            you review and send the message there.
          </p>
          <form onSubmit={handleSubmit} aria-describedby="form-help">
            <div className="field">
              <label htmlFor="enquiry-name">Name *</label>
              <input
                id="enquiry-name"
                name="name"
                type="text"
                autoComplete="name"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="enquiry-email">Email (optional)</label>
              <input
                id="enquiry-email"
                name="email"
                type="email"
                autoComplete="email"
              />
            </div>
            <div className="field">
              <label htmlFor="enquiry-interest">I’m interested in</label>
              <select
                key={selectedInterest}
                id="enquiry-interest"
                name="interest"
                defaultValue={selectedInterest}
              >
                <option>Textures &amp; finishes</option>
                <option>Building materials</option>
                <option>Import &amp; export</option>
                <option>Dealer enquiry</option>
                <option>General enquiry</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="enquiry-requirement">Your requirement *</label>
              <textarea
                id="enquiry-requirement"
                name="requirement"
                rows={5}
                required
                placeholder="Share the material, finish or trade enquiry, along with any specifications, quantities or timelines."
              />
            </div>
            <button type="submit" className="button button-primary">
              <MessageCircle size={18} aria-hidden="true" /> Continue in
              WhatsApp
            </button>
            <p className="muted" role="status" aria-live="polite">
              {notice}
            </p>
          </form>
        </section>

        <aside aria-labelledby="direct-contact">
          <h2 id="direct-contact">Connect directly</h2>
          <div className="info-card glass-panel">
            <Mail aria-hidden="true" />
            <h3>Email</h3>
            <a className="text-link" href="mailto:paniar888@gmail.com">
              paniar888@gmail.com
            </a>
          </div>
          <div className="info-card glass-panel">
            <Phone aria-hidden="true" />
            <h3>Pranav Salgotra</h3>
            <p className="muted">Sales &amp; Sourcing Executive</p>
            <a className="text-link" href="tel:+918968310500">
              +91 89683 10500
            </a>
          </div>
          <div className="info-card glass-panel">
            <MessageCircle aria-hidden="true" />
            <h3>WhatsApp</h3>
            <p className="muted">
              Prefer to start with a chat? Open a conversation with Paniar.
            </p>
            <a
              className="button button-glass"
              href="https://wa.me/918968310500"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open WhatsApp <ArrowUpRight size={18} aria-hidden="true" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
          <div className="info-card glass-panel">
            <h3>Registered business</h3>
            <p>PANIAR · Proprietor: Rakesh Kumar</p>
            <p>GSTIN: 03ARCPK7508A2ZE</p>
            <p className="muted">First Floor, B-28-609/1/J/2, Opp. Toor Clinic, Near Ravi Dass Gurudwara Dharmshala, Jawaddi Kalan, Ludhiana, Punjab 141013</p>
          </div>
          <p className="muted">
            Get to know{" "}
            <Link href="/about" className="text-link">
              Paniar and our focus
            </Link>
            .
          </p>
        </aside>
      </div>
    </main>
  );
}

export default function ContactPage() {
  return (
    <Suspense
      fallback={
        <main id="main-content" className="subpage page-shell">
          <p>Loading enquiry form…</p>
        </main>
      }
    >
      <ContactEnquiry />
    </Suspense>
  );
}
