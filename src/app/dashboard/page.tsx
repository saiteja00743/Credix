"use client";

import { motion } from "framer-motion";
import { Zap, Download, Share2, Copy, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import CountUp from "@/components/AnimatedCountUp";
import ToolBreakdownTable, { UpsellBanner } from "@/components/ToolBreakdown";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { runAuditEngine, AuditResult } from "@/lib/auditEngine";

function SharePanel({ resultId }: { resultId: string }) {
  const [copied, setCopied] = useState(false);
  const [baseUrl, setBaseUrl] = useState("");
  
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBaseUrl(window.location.origin);
  }, []);
  
  const link = `${baseUrl}/report/${resultId}`;

  const copy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card rounded-2xl p-7 border border-[#3c4a42]/15 h-full flex flex-col">
      <h3 className="text-[18px] font-semibold mb-2">Share Report</h3>
      <p className="text-[13px] text-on-surface-variant mb-6">
        Generate a public-facing link with sensitive data redacted for stakeholders.
      </p>

      {/* Preview mock */}
      <div className="bg-surface-container-high rounded-xl p-4 mb-6 border border-[#3c4a42]/15 flex-1">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded bg-surface-container-highest animate-pulse" />
          <div className="space-y-1.5">
            <div className="h-2 w-20 bg-surface-container-highest rounded animate-pulse" />
            <div className="h-2 w-12 bg-surface-container-highest/60 rounded animate-pulse" />
          </div>
        </div>
        <div className="h-2.5 w-full bg-primary/20 rounded mb-2" />
        <div className="h-2.5 w-3/4 bg-primary/15 rounded mb-2" />
        <div className="h-2.5 w-1/2 bg-primary/10 rounded" />
      </div>

      {/* Link */}
      <div className="bg-surface-container rounded-lg p-3 flex items-center justify-between gap-2 mb-4 border border-[#3c4a42]/20">
        <span className="text-[12px] text-on-surface-variant truncate font-mono">{baseUrl ? link : "..."}</span>
        <button onClick={copy} className={cn("flex-shrink-0 flex items-center gap-1.5 text-[12px] font-medium transition-colors px-2 py-1 rounded", copied ? "text-primary" : "text-on-surface-variant hover:text-on-surface")}>
          {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="flex gap-3">
        <button className="flex-1 flex items-center justify-center gap-2 bg-surface-container-high hover:bg-surface-bright border border-[#3c4a42]/20 rounded-xl py-3 text-[13px] font-medium transition-colors">
          <Share2 className="w-4 h-4" /> Share
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 bg-surface-container-high hover:bg-surface-bright border border-[#3c4a42]/20 rounded-xl py-3 text-[13px] font-medium transition-colors">
          <Download className="w-4 h-4" /> Export PDF
        </button>
      </div>
    </div>
  );
}

function InsightCard({ audit }: { audit: AuditResult }) {
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [summarySource, setSummarySource] = useState<string>("loading");

  const redundantSeats = audit.toolResults.filter(t => t.recommendation.type === "consolidation").length;
  const downgradeCount = audit.toolResults.filter(t => t.recommendation.type === "downgrade").length;
  const creditsCount = audit.toolResults.filter(t => t.recommendation.type === "credits").length;

  useEffect(() => {
    async function fetchSummary() {
      try {
        const res = await fetch("/api/summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            totalCurrentSpend: audit.totalCurrentSpend,
            totalMonthlySavings: audit.totalMonthlySavings,
            totalAnnualSavings: audit.totalAnnualSavings,
            toolResults: audit.toolResults,
          }),
        });
        const data = await res.json();
        setAiSummary(data.summary);
        setSummarySource(data.source || "fallback");
      } catch {
        // Network failure — use inline fallback
        setAiSummary(
          `Based on our analysis of your ${audit.toolResults.length} AI platform(s), your organization currently spends $${audit.totalCurrentSpend.toLocaleString()}/month on AI infrastructure. Our audit engine identified $${audit.totalMonthlySavings.toFixed(0)}/month in potential savings ($${audit.totalAnnualSavings.toLocaleString()} annually).`
        );
        setSummarySource("fallback");
      }
    }
    fetchSummary();
  }, [audit]);

  return (
    <div className="glass-card gradient-border-emerald rounded-2xl p-7 relative overflow-hidden h-full">
      <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-11 h-11 bg-primary/10 rounded-full border border-primary/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-[20px] font-semibold">Personalized AI Summary</h2>
            {summarySource === "anthropic" && (
              <span className="text-[10px] text-on-surface-variant font-medium tracking-wide uppercase">Powered by Claude</span>
            )}
          </div>
        </div>
        <div className="space-y-4 text-on-surface-variant text-[14px] leading-relaxed">
          {summarySource === "loading" ? (
            <div className="space-y-3">
              <div className="h-3 w-full bg-surface-container-high rounded animate-pulse" />
              <div className="h-3 w-5/6 bg-surface-container-high rounded animate-pulse" />
              <div className="h-3 w-3/4 bg-surface-container-high rounded animate-pulse" />
            </div>
          ) : (
            <p>{aiSummary}</p>
          )}
        </div>

        {/* Mini savings badges */}
        <div className="mt-6 flex flex-wrap gap-2">
          {redundantSeats > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/8 border border-primary/15 text-primary text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              {redundantSeats} redundancy warning{redundantSeats > 1 ? "s" : ""}
            </span>
          )}
          {downgradeCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/8 border border-primary/15 text-primary text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              {downgradeCount} tier downgrade{downgradeCount > 1 ? "s" : ""} detected
            </span>
          )}
          {creditsCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffb4ab]/10 border border-[#ffb4ab]/20 text-[#ffb4ab] text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffb4ab]" />
              Credit eligible
            </span>
          )}
          {redundantSeats === 0 && downgradeCount === 0 && creditsCount === 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              Highly optimized
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formData, setFormData] = useState<any>(null);
  
  useEffect(() => {
    try {
      const saved = localStorage.getItem("credex_audit_form");
      if (saved) {
        const parsed = JSON.parse(saved);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData(parsed);
        if (parsed.tools && parsed.tools.length > 0) {
          const result = runAuditEngine(parsed.tools, parsed.teamSize);
          setAuditResult(result);
        }
      }
    } catch (e) {
      console.error("Failed to load audit", e);
    }
  }, []);

  if (!auditResult) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-2 border-primary/30 border-t-primary animate-spin mx-auto mb-4" />
          <p className="text-on-surface-variant font-medium">Generating Report...</p>
        </div>
      </div>
    );
  }

  const wasteRate = auditResult.totalCurrentSpend > 0 
    ? Math.round((auditResult.totalMonthlySavings / auditResult.totalCurrentSpend) * 100) 
    : 0;

  const METRIC_CARDS = [
    {
      label: "Monthly Savings",
      value: auditResult.totalMonthlySavings,
      prefix: "$",
      suffix: "",
      decimals: 2,
      color: "text-primary",
      borderColor: "border-l-primary",
      desc: "Identified this audit",
    },
    {
      label: "Annual Savings",
      value: auditResult.totalAnnualSavings,
      prefix: "$",
      suffix: "",
      decimals: 2,
      color: "text-secondary",
      borderColor: "border-l-secondary",
      desc: "Projected run-rate",
    },
    {
      label: "Waste Rate",
      value: wasteRate,
      prefix: "",
      suffix: "%",
      decimals: 0,
      color: "text-tertiary",
      borderColor: "border-l-tertiary",
      desc: "Of total AI spend",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top nav */}
      <nav className="fixed top-0 w-full z-50 bg-[#0e1511]/90 backdrop-blur-xl border-b border-[#3c4a42]/20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary" strokeWidth={2.5} />
            </div>
            <span className="text-[20px] font-bold tracking-tight">
              Credex<span className="text-primary">AI</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden md:flex items-center gap-2 text-[13px] text-on-surface-variant">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Audit Complete · {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
            <Link href="/" className="text-[14px] font-medium text-on-surface-variant hover:text-on-surface transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 max-w-[1440px] mx-auto px-6 md:px-12">

        {/* Hero summary */}
        <header className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-8"
          >
            <div className="space-y-4 min-w-0">
              <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.08em] uppercase text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                AI Spend Audit Complete
              </span>
              <h1 className="text-[36px] md:text-[44px] xl:text-[56px] font-semibold tracking-[-0.02em] leading-[1.08] text-balance">
                {auditResult.totalMonthlySavings > 0 ? "Optimization Identified." : "Efficient Stack."}
              </h1>
              <p className="text-on-surface-variant text-[16px] md:text-[17px] leading-relaxed max-w-xl text-balance">
                {auditResult.totalMonthlySavings > 0 
                  ? "We've analyzed your SaaS stack. Here is how you can reallocate capital from idle AI seats to high-growth initiatives."
                  : "Your team is running efficiently with no major redundancies detected. Great job optimizing your AI spend!"}
              </p>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-2 gap-4 md:flex md:flex-wrap md:justify-end xl:flex-nowrap md:gap-4 shrink-0 mt-8 md:mt-0">
              {METRIC_CARDS.map((card, i) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.1 }}
                  className={cn("glass-card p-6 rounded-2xl border-l-4 min-w-[180px]", card.borderColor)}
                >
                  <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-on-surface-variant mb-2">
                    {card.label}
                  </p>
                  <p className={cn("font-mono text-[28px] font-bold", card.color)}>
                    <CountUp
                      end={card.value}
                      prefix={card.prefix}
                      suffix={card.suffix}
                      decimals={card.decimals}
                      duration={2}
                    />
                  </p>
                  <p className="text-[11px] text-on-surface-variant mt-1">{card.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </header>

        {/* AI Insight + Share bento */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="md:col-span-8"
          >
            <InsightCard audit={auditResult} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="md:col-span-4"
          >
            <SharePanel resultId={formData?.company?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || "abc123"} />
          </motion.div>
        </section>

        {/* Tool breakdown table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <ToolBreakdownTable audit={auditResult} />
        </motion.div>

        {/* Upsell */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {auditResult.totalMonthlySavings > 100 ? (
            <UpsellBanner savings={auditResult.totalAnnualSavings} />
          ) : (
            <div className="mt-16 bg-surface-container rounded-2xl border border-[#3c4a42]/30 p-8 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-[20px] font-semibold mb-2">You&apos;re already spending efficiently</h3>
              <p className="text-on-surface-variant text-[14px] max-w-lg mx-auto">
                Our engine didn&apos;t find significant redundancies or waste in your stack. Keep up the good work! If your team scales beyond 50 members, reach out to us for enterprise rate negotiation.
              </p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
