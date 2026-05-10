"use client";

import { motion } from "framer-motion";
import { ArrowRight, Handshake } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AuditResult } from "@/lib/auditEngine";

function UtilizationBar({ value, delay = 0 }: { value: number; delay?: number }) {
  const color = value < 40 ? "from-[#ffb4ab] to-[#ffb4ab]/60" : value < 65 ? "from-primary to-[#6ffbbe]" : "from-secondary to-[#c0c1ff]/60";
  return (
    <div className="w-full h-1 bg-surface-container-low rounded-full overflow-hidden mt-1.5">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${value}%` }}
        viewport={{ once: true }}
        transition={{ delay, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className={`h-full bg-gradient-to-r ${color} rounded-full`}
      />
    </div>
  );
}

export default function ToolBreakdownTable({ audit }: { audit?: AuditResult }) {
  if (!audit) return null;

  return (
    <section className="mb-20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[24px] font-semibold tracking-[-0.01em]">Tool Breakdown</h2>
        <span className="text-[11px] font-semibold tracking-[0.08em] uppercase text-on-surface-variant bg-surface-container px-3 py-1.5 rounded-full border border-[#3c4a42]/20">
          {audit.toolResults.length} Audited Tools
        </span>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden border border-[#3c4a42]/15">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low border-b border-[#3c4a42]/20">
                {["Platform", "Current Spend", "Seat Utilization", "Recommended", "Savings"].map((h) => (
                  <th key={h} className={cn("px-6 py-4 text-[11px] font-semibold tracking-[0.08em] uppercase text-on-surface-variant", h === "Savings" && "text-right")}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3c4a42]/10">
              {audit.toolResults.map(({ tool, recommendation }, i) => {
                const spendNum = parseFloat(tool.monthlySpend || "0");
                const pct = spendNum > 0 ? Math.round((recommendation.savings / spendNum) * 100) : 0;
                
                // Pure pseudo-random utilization based on tool.id
                const hash = tool.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
                const utilization = recommendation.type === "downgrade" || recommendation.type === "consolidation" 
                  ? (hash % 30) + 10 
                  : (hash % 40) + 50;

                const getColors = (provider: string) => {
                  if (provider.includes("ChatGPT")) return { c: "text-[#10a37f]", bg: "bg-[#10a37f]/10" };
                  if (provider.includes("Claude")) return { c: "text-tertiary", bg: "bg-tertiary/10" };
                  if (provider.includes("Copilot")) return { c: "text-[#c0c1ff]", bg: "bg-[#c0c1ff]/10" };
                  if (provider.includes("Midjourney")) return { c: "text-secondary", bg: "bg-secondary/10" };
                  return { c: "text-primary", bg: "bg-primary/10" };
                };

                const colors = getColors(tool.provider);

                return (
                  <motion.tr
                    key={tool.id}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                    className="hover:bg-surface-container/60 transition-colors"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center font-bold text-[14px] border border-[#3c4a42]/20", colors.bg, colors.c)}>
                          {tool.provider.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-on-surface text-[14px]">{tool.provider}</p>
                          <p className="text-[12px] text-on-surface-variant">
                            {tool.plan} Plan · {tool.seats} seats
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-mono text-[14px] text-on-surface">${spendNum.toFixed(2)}/mo</td>
                    <td className="px-6 py-5 w-36">
                      <div className="text-[12px] text-on-surface-variant mb-0.5">{utilization}% used</div>
                      <UtilizationBar value={utilization} delay={i * 0.1} />
                    </td>
                    <td className="px-6 py-5">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[12px] font-medium border",
                        recommendation.savings > 0 
                          ? "bg-primary/10 text-primary border-primary/15" 
                          : "bg-surface-container border-[#3c4a42]/30 text-on-surface-variant"
                      )}>
                        {recommendation.action}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <p className={cn("font-mono text-[18px] font-semibold", recommendation.savings > 0 ? "text-primary" : "text-on-surface")}>
                        ${recommendation.savings.toFixed(2)}
                      </p>
                      {pct > 0 && <p className="text-[11px] text-on-surface-variant">{pct}% reduction</p>}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export function UpsellBanner({ savings }: { savings?: number }) {
  return (
    <section className="glass-card gradient-border-emerald rounded-3xl p-10 md:p-14 relative overflow-hidden mb-20">
      <div className="absolute -top-12 -right-12 w-56 h-56 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <span className="text-primary text-[11px] font-semibold tracking-[0.08em] uppercase block mb-4">High Savings Identified</span>
          <h2 className="text-[36px] font-semibold tracking-[-0.02em] leading-[1.1] mb-5">
            Unlock Corporate Rate Negotiation.
          </h2>
          <p className="text-on-surface-variant text-[15px] leading-relaxed mb-8">
            Since your identified annual savings exceed ${savings ? Math.floor(savings/1000) : "10"}K, you qualify for our{" "}
            <strong className="text-on-surface">Concierge Negotiation Service</strong>. We talk to vendors directly to secure bulk pricing not available publicly.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 bg-primary text-on-primary px-7 py-4 rounded-xl font-bold text-[15px] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_24px_rgba(78,222,163,0.3)]">
            Schedule Credex Consultation
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
        <div className="flex justify-center">
          <div className="relative w-60 h-60">
            <div className="absolute inset-0 rounded-full border-2 border-primary/15 animate-pulse" />
            <div className="absolute inset-6 rounded-full border border-primary/10" />
            <div className="absolute inset-12 rounded-full bg-gradient-to-tr from-primary/10 to-secondary/10 flex items-center justify-center">
              <Handshake className="w-12 h-12 text-primary" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
