"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Zap } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#product", label: "Product" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-300",
          scrolled ? "bg-background/90 backdrop-blur-2xl border-b border-outline-variant/30 shadow-[0_4px_30px_rgba(0,0,0,0.3)]" : "bg-transparent border-transparent"
        )}
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform">
              <img src="/icon.png" alt="Credex Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-[22px] font-bold tracking-tight text-on-surface">
              Credex<span className="text-primary">AI</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-on-surface-variant hover:text-primary transition-colors duration-200 text-[15px] font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-on-surface-variant hover:text-on-surface transition-colors text-[15px] font-medium"
            >
              View Dashboard
            </Link>
            <ThemeToggle />
            <Link
              href="#audit-form"
              className="relative group bg-primary text-on-primary px-5 py-2.5 rounded-lg text-[15px] font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-[0_0_20px_rgba(78,222,163,0.25)] hover:shadow-[0_0_28px_rgba(78,222,163,0.4)]"
            >
              Run Free Audit
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 left-0 right-0 z-40 glass-modal border-b border-outline-variant/20 py-6 px-6"
          >
            <div className="flex flex-col gap-5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-on-surface-variant hover:text-primary transition-colors text-[16px] font-medium"
                >
                  {link.label}
                </Link>
              ))}
              <div className="h-px bg-outline-variant/30 my-1" />
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="text-on-surface-variant hover:text-primary transition-colors text-[16px] font-medium"
              >
                View Dashboard
              </Link>
              <Link
                href="#audit-form"
                onClick={() => setMobileOpen(false)}
                className="bg-primary text-on-primary px-5 py-3 rounded-lg text-[15px] font-semibold text-center"
              >
                Run Free Audit
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
