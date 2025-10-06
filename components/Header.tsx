"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaXmark } from "react-icons/fa6";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/shop" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Floating Shadow/Glass Behind Header */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute inset-0 bg-white/70 backdrop-blur-xl shadow-[0_5px_30px_rgba(0,0,0,0.05)] rounded-b-3xl"></div>
      </div>

      {/* Top Contact Bar */}
      <div className="hidden md:flex h-10 bg-blue-600 text-white text-sm items-center justify-between px-6 sm:px-12 max-w-7xl mx-auto relative z-20">
        <div className="flex gap-6 items-center">
          <span className="flex items-center gap-2">📞 +91 83607 46541</span>
          <span className="flex items-center gap-2">
            ✉️ paniar888@gmail.com
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 relative z-20">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 transform transition-all duration-300 hover:scale-105"
          aria-label="Home"
        >
          <Image
            src="/logo v1.png"
            alt="Paniar logo"
            width={160}
            height={48}
            className="object-contain"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="relative text-gray-800 hover:text-blue-600 font-medium transition-colors group"
            >
              {link.name}
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-lg bg-white/40 hover:bg-white/60 transition-colors z-30 relative"
          aria-label="Toggle Menu"
        >
          {menuOpen ? (
            <FaXmark className="w-6 h-6 text-gray-800" />
          ) : (
            <FaBars className="w-6 h-6 text-gray-800" />
          )}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            key="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden absolute top-full left-0 w-full bg-white/90 backdrop-blur-2xl border-b border-white/30 shadow-lg z-20"
          >
            {/* Floating Blobs */}
            <div className="pointer-events-none absolute -top-16 -left-16 w-48 h-48 bg-blue-300/20 rounded-full filter blur-3xl animate-blob"></div>
            <div className="pointer-events-none absolute -bottom-16 -right-16 w-64 h-64 bg-purple-300/20 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>

            <div className="flex flex-col items-center gap-6 py-6 relative z-10">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-lg font-medium text-gray-800 hover:text-blue-600 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
