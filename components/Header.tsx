"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const links = [
    { label: "Home", href: "/" },
    { label: "What we do", href: "/#expertise" },
    { label: "Catalogue", href: "/shop" },
    { label: "Our story", href: "/about" },
  ];
  return (
    <header className="site-header">
      <div className="nav-shell glass-panel">
        <Link
          href="/"
          className="brand"
          aria-label="Paniar home"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/logo v1.png"
            alt="Paniar"
            width={132}
            height={42}
            priority
          />
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link href="/contact" className="button button-primary nav-cta">
          Let’s talk <ArrowUpRight size={16} />
        </Link>
        <button
          type="button"
          className="menu-toggle glass-icon"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          className="mobile-nav glass-panel"
          aria-label="Mobile navigation"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
            >
              {link.label}
              <ArrowUpRight size={17} />
            </Link>
          ))}
          <Link href="/contact" onClick={() => setOpen(false)}>
            Start an enquiry
            <ArrowUpRight size={17} />
          </Link>
        </nav>
      )}
    </header>
  );
}
