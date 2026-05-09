"use client";

import { motion } from "framer-motion";
import { Zap, Copy, CheckCircle2, ExternalLink, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { runAuditEngine, AuditResult } from "@/lib/auditEngine";
import CountUp from "@/components/AnimatedCountUp";

/**
 * ReportClient — The publicly shareable audit report page.
 *
 * Two modes:
 * 1. If `audit` prop is provided (from Supabase SSR), renders with full data.
 * 2. If `audit` is null (DB not configured / expired link), falls back to
 *    localStorage data so the user can still see THEIR own report.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ReportClient({ audit, auditId }: { audit: any; auditId: string }) {
  const [copied, setCopied] = useState(false);
  const [localAudit, setLocalAudit] = useState<AuditResult | null>(null);
  const [baseUrl, setBaseUrl] = useState("");
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBaseUrl(window.location.origin);

    // Try to load from localStorage as fallback
    try {
      const saved = localStorage.getItem("credex_audit_form");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.tools?.length > 0) {
          const result = runAuditEngine(parsed.tools, parsed.teamSize);
          setLocalAudit(result);
          // Check if this report likely belongs to the current user
          // by seeing if their last audit ID matches (stored after lead submit)
          const savedId = localStorage.getItem("credex_last_audit_id");
          if (savedId === auditId) setIsOwner(true);
        }
      }
    } catch {
      // ignore
    }
  }, [auditId]);

  const shareUrl = `${baseUrl}/report/${auditId}`;

  const copy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Resolve the data source
  const monthlySavings: number = audit?.total_monthly_savings ?? localAudit?.totalMonthlySavings ?? 0;
  const annualSavings: number = audit?.total_annual_savings ?? localAudit?.totalAnnualSavings ?? 0;
  const currentSpend: number = audit?.total_current_spend ?? localAudit?.totalCurrentSpend ?? 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tools: any[] = audit?.tools ?? localAudit?.toolResults ?? [];
  const wasteRate = currentSpend > 0 ? Math.round((monthlySavings / currentSpend) * 100) : 0;

  const noData = !audit && !localAudit;

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-background/90 backdrop-blur-xl border-b border-[#3c4a42]/20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary" strokeWidth={2.5} />
            </div>
            <span className="text-[20px] font-bold tracking-tight">
              Credex<span className="text-primary">AI</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {/* Share button */}
            <button
              onClick={copy}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold border transition-all duration-200",
                copied
                  ? "bg-primary/15 border-primary/30 text-primary"
                  : "bg-surface-container border-[#3c4a42]/30 text-on-surface-variant hover:text-on-surface hover:border-primary/30"
              )}
            >
              {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy Link"}
            </button>

            <Link
              href="/#audit-form"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-on-primary text-[13px] font-semibold shadow-[0_0_16px_rgba(78,222,163,0.25)] hover:shadow-[0_0_24px_rgba(78,222,163,0.4)] transition-shadow"
            >
              Run Your Audit <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 max-w-[1440px] mx-auto px-6 md:px-12">
        {noData ? (
          /* ── No data state ── */
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center min-h-[60vh] text-center"
          >
            <div className="w-14 h-14 rounded-full bg-surface-container border border-[#3c4a42]/30 flex items-center justify-center mb-6">
              <AlertCircle className="w-6 h-6 text-on-surface-variant" />
            </div>
            <h1 className="text-[28px] font-semibold mb-3">Report not found</h1>
            <p className="text-on-surface-variant text-[15px] max-w-sm mb-8">
              This audit link may have expired or the report was never saved. Run
              a fresh audit to generate a new shareable link.
            </p>
            <Link
              href="/#audit-form"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-on-primary font-semibold shadow-[0_0_20px_rgba(78,222,163,0.3)] hover:shadow-[0_0_32px_rgba(78,222,163,0.45)] transition-shadow"
            >
              Start Free Audit <ExternalLink className="w-4 h-4" />
            </Link>
          </motion.div>
        ) : (
          <>
            {/* ── Header ── */}
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-14"
            >
              <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.08em] uppercase text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Shared AI Spend Report
              </span>
              <h1 className="text-[36px] md:text-[48px] font-semibold tracking-[-0.02em] leading-[1.1] mb-4">
                {annualSavings > 0
                  ? `$${Math.round(annualSavings).toLocaleString()} in annual savings identified`
                  : "AI stack is well optimized"}
              </h1>
              <p className="text-on-surface-variant text-[16px] max-w-2xl leading-relaxed">
                This report was generated by Credex AI and covers{" "}
                <strong className="text-on-surface">{tools.length} AI tool{tools.length !== 1 ? "s" : ""}</strong>{" "}
                in the audited stack. Sensitive company data has been redacted for this public view.
              </p>

              {isOwner && (
                <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/8 border border-primary/20 text-primary text-[12px] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  This is your report — share the link with stakeholders
                </div>
              )}
            </motion.header>

            {/* ── KPI Cards ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14"
            >
              {[
                { label: "Monthly Savings", value: monthlySavings, prefix: "$", suffix: "", decimals: 0, color: "text-primary", border: "border-l-primary" },
                { label: "Annual Savings", value: annualSavings, prefix: "$", suffix: "", decimals: 0, color: "text-secondary", border: "border-l-secondary" },
                { label: "Waste Rate", value: wasteRate, prefix: "", suffix: "%", decimals: 0, color: "text-tertiary", border: "border-l-tertiary" },
                { label: "Tools Audited", value: tools.length, prefix: "", suffix: "", decimals: 0, color: "text-on-surface", border: "border-l-[#3c4a42]" },
              ].map((card, i) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.08 }}
                  className={cn("glass-card p-6 rounded-2xl border-l-4", card.border)}
                >
                  <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-on-surface-variant mb-2">{card.label}</p>
                  <p className={cn("font-mono text-[26px] font-bold", card.color)}>
                    <CountUp end={card.value} prefix={card.prefix} suffix={card.suffix} decimals={card.decimals} duration={1.8} />
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* ── Recommendations list ── */}
            {localAudit?.toolResults && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-14"
              >
                <h2 className="text-[22px] font-semibold mb-6">Optimization Recommendations</h2>
                <div className="space-y-4">
                  {localAudit.toolResults.map(({ tool, recommendation }, i) => (
                    <motion.div
                      key={tool.id}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.45 + i * 0.07 }}
                      className="glass-card rounded-2xl p-6 border border-[#3c4a42]/20 flex flex-col md:flex-row md:items-center gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[13px] font-bold text-on-surface">{tool.provider}</span>
                          <span className={cn(
                            "text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full",
                            recommendation.type === "optimal"
                              ? "bg-primary/10 text-primary"
                              : recommendation.type === "consolidation"
                              ? "bg-[#ffb4ab]/10 text-[#ffb4ab]"
                              : recommendation.type === "credits"
                              ? "bg-secondary/10 text-secondary"
                              : "bg-tertiary/10 text-tertiary"
                          )}>
                            {recommendation.type}
                          </span>
                        </div>
                        <p className="text-[13px] font-semibold text-on-surface mb-1">{recommendation.action}</p>
                        <p className="text-[12px] text-on-surface-variant leading-relaxed">{recommendation.reasoning}</p>
                      </div>
                      {recommendation.savings > 0 && (
                        <div className="shrink-0 text-right">
                          <p className="text-[11px] text-on-surface-variant uppercase tracking-wide font-semibold">Saves</p>
                          <p className="text-[22px] font-bold font-mono text-primary">
                            ${Math.round(recommendation.savings).toLocaleString()}
                            <span className="text-[13px] text-on-surface-variant font-normal">/mo</span>
                          </p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* ── CTA ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="glass-card gradient-border-emerald rounded-2xl p-10 text-center relative overflow-hidden"
            >
              <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-primary/6 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10">
                <h3 className="text-[26px] font-semibold mb-3">Get your own audit — it&apos;s free</h3>
                <p className="text-on-surface-variant text-[15px] mb-8 max-w-lg mx-auto">
                  Input your AI stack and receive an instant, personalized analysis of your spending.
                  No credit card. Takes 90 seconds.
                </p>
                <Link
                  href="/#audit-form"
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-primary text-on-primary font-bold text-[15px] shadow-[0_0_24px_rgba(78,222,163,0.35)] hover:shadow-[0_0_40px_rgba(78,222,163,0.5)] transition-shadow"
                >
                  Start My Free Audit <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </main>
    </div>
  );
}
