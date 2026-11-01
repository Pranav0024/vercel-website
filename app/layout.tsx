import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/floatingwhatsapp";
import ScrollReveal from "@/components/ScrollReveal";
import { SITE_URL, SITE_DESCRIPTION, jsonLd } from "@/lib/seo";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  verification: { google: "T2io8QPt0QeCNRc7WGw0dkU0HgQqcSXt3ldvIpC0qOw" },
  title: {
    default: "Paniar | Textures, Building Materials & Product Sourcing",
    template: "%s | Paniar",
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  openGraph: { title: "Paniar | Textures, Building Materials & Product Sourcing", description: SITE_DESCRIPTION, url: SITE_URL, siteName: "Paniar", locale: "en_IN", type: "website", images: [{ url: "/images/materials-interior.jpg", alt: "Textures and architectural materials" }] },
  twitter: { card: "summary_large_image", title: "Paniar | Textures, Building Materials & Product Sourcing", description: SITE_DESCRIPTION, images: ["/images/materials-interior.jpg"] },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body id="top" className={geist.variable}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: "Paniar", url: SITE_URL, logo: `${SITE_URL}/logo%20v1.png`, description: SITE_DESCRIPTION, email: "paniar888@gmail.com", telephone: "+918968310500", contactPoint: { "@type": "ContactPoint", telephone: "+918968310500", contactType: "sales", email: "paniar888@gmail.com" }, knowsAbout: ["Textures and finishes", "Building materials", "Texture application tools", "Product sourcing", "Imports and exports"] },
            { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: "Paniar", url: SITE_URL, inLanguage: "en-IN", publisher: { "@id": `${SITE_URL}/#organization` } },
          ],
        }) }} />
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Header />
        {children}
        <Footer />
        <FloatingWhatsApp />
        <ScrollReveal />
      </body>
    </html>
  );
}
