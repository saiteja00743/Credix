"use client";

import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, Minus, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { AuditResult } from "@/lib/auditEngine";

export default function BenchmarkCard({ audit }: { audit?: AuditResult }) {
  if (!audit) return null;

  const { benchmark } = audit;
  const isBetterThanAvg = benchmark.userSpendPerDev < benchmark.avgSpendPerDev;
  const diff = Math.abs(
    ((benchmark.userSpendPerDev - benchmark.avgSpendPerDev) / benchmark.avgSpendPerDev) * 100
  );

  return (
    <section className="mb-20">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-[20px] font-semibold tracking-[-0.01em]">Efficiency Benchmark</h2>
        <div className="group relative">
          <Info className="w-4 h-4 text-on-surface-variant cursor-help" />
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-surface-container-high border border-[#3c4a42]/30 rounded-xl text-[12px] text-on-surface-variant opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 shadow-xl">
            Calculated by dividing total AI spend by the estimated developer count for a{" "}
            <strong>{audit.benchmark.label}</strong>.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Your Spend per Dev */}
        <div className="glass-card rounded-[24px] p-8 border border-[#3c4a42]/15 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-on-surface-variant mb-4">
              Your AI Spend / Dev
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-[32px] font-semibold">${Math.round(benchmark.userSpendPerDev)}</span>
              <span className="text-on-surface-variant text-[14px]">/mo</span>
            </div>
            <p className="text-[13px] text-on-surface-variant mt-2">
              Based on mid-point estimate
            </p>
          </div>
        </div>

        {/* Market Average */}
        <div className="glass-card rounded-[24px] p-8 border border-[#3c4a42]/15">
          <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-on-surface-variant mb-4">
            Market Average
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-[32px] font-semibold text-on-surface-variant/80">
              ${Math.round(benchmark.avgSpendPerDev)}
            </span>
            <span className="text-on-surface-variant/60 text-[14px]">/mo</span>
          </div>
          <p className="text-[13px] text-on-surface-variant mt-2">
            For {benchmark.label}
          </p>
        </div>

        {/* Percentile / Comparison */}
        <div
          className={cn(
            "glass-card rounded-[24px] p-8 border relative overflow-hidden",
            isBetterThanAvg
              ? "bg-primary/[0.03] border-primary/20"
              : "bg-[#ffb4ab]/[0.03] border-[#ffb4ab]/20"
          )}
        >
          <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-on-surface-variant mb-4">
            Efficiency Ranking
          </p>
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                isBetterThanAvg ? "bg-primary/10 text-primary" : "bg-[#ffb4ab]/10 text-[#ffb4ab]"
              )}
            >
              {isBetterThanAvg ? (
                <TrendingDown className="w-5 h-5" />
              ) : diff < 10 ? (
                <Minus className="w-5 h-5" />
              ) : (
                <TrendingUp className="w-5 h-5" />
              )}
            </div>
            <div>
              <span className="text-[20px] font-bold">
                {isBetterThanAvg ? "Below" : diff < 10 ? "At" : "Above"} Average
              </span>
              <p className={cn("text-[13px] font-medium", isBetterThanAvg ? "text-primary" : "text-[#ffb4ab]")}>
                {Math.round(diff)}% {isBetterThanAvg ? "more efficient" : "higher spend"}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between text-[11px] font-medium text-on-surface-variant mb-1.5">
              <span>Percentile Ranking</span>
              <span>Top {100 - benchmark.percentile}%</span>
            </div>
            <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${benchmark.percentile}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className={cn("h-full rounded-full", isBetterThanAvg ? "bg-primary" : "bg-[#ffb4ab]")}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
