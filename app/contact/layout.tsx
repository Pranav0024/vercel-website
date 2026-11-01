import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Make an enquiry",
  description:
    "Contact Paniar for textures, building materials, product sourcing, and import or export enquiries.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
