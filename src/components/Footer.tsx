import Link from "next/link";
import { Zap, Globe, ExternalLink, Mail } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Audit Engine", href: "#" },
    { label: "Benchmarks", href: "#" },
    { label: "Integrations", href: "#" },
    { label: "Pricing", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact Sales", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Security", href: "#" },
    { label: "SOC-2 Report", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="w-full border-t border-[#3c4a42]/20 bg-surface-container-lowest">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12">
          {/* Brand col */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
                <img src="/icon.png" alt="Credex Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-[22px] font-bold tracking-tight">
                Credex<span className="text-primary">AI</span>
              </span>
            </div>
            <p className="text-on-surface-variant text-[14px] leading-relaxed max-w-xs mb-8">
              Precision-engineered financial intelligence for the AI era. Stop overpaying for tools your team doesn&apos;t use.
            </p>
            {/* Social */}
            <div className="flex items-center gap-3">
              {[
                { icon: Globe, label: "Website", href: "#" },
                { icon: ExternalLink, label: "LinkedIn", href: "#" },
                { icon: Mail, label: "Email", href: "#" },
              ].map(({ icon: Icon, label, href }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-surface-container-high border border-[#3c4a42]/30 flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary/30 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-[11px] font-semibold tracking-[0.08em] uppercase text-primary mb-5">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-on-surface-variant hover:text-on-surface transition-colors text-[14px]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-[#3c4a42]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-on-surface-variant text-[13px]">
            © 2024 Credex AI, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-primary text-[13px] font-medium">
              All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
