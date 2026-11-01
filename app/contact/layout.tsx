import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Contact Us for Materials & Sourcing Enquiries", "Contact Paniar on +91 89683 10500 for textures, building materials, application tools, bulk quotations and import-export sourcing enquiries.", "/contact");

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
