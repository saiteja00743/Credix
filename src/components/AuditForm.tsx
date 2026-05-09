"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, ArrowRight, Lock, ChevronDown, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const AI_PROVIDERS = [
  "Cursor",
  "ChatGPT / OpenAI",
  "Claude / Anthropic",
  "GitHub Copilot",
  "Gemini / Google",
  "Windsurf / Codeium",
  "Midjourney",
  "Perplexity AI",
  "Other / Custom API",
];

const USE_CASES = [
  "Customer Support",
  "Software Engineering",
  "Marketing / Creative",
  "Data Analysis",
  "Internal Operations",
  "Research & Writing",
];

const TEAM_SIZES = ["1–10", "11–50", "51–250", "251–1,000", "1,000+"];

interface ToolEntry {
  id: string;
  provider: string;
  monthlySpend: string;
  seats: string;
  useCase: string;
}

interface FormErrors {
  tools?: string;
  company?: string;
  role?: string;
  email?: string;
  teamSize?: string;
}

function ToolCard({
  tool,
  index,
  onUpdate,
  onRemove,
  canRemove,
}: {
  tool: ToolEntry;
  index: number;
  onUpdate: (id: string, field: keyof ToolEntry, value: string) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16, scale: 0.97 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="bg-surface-container rounded-2xl border border-[#3c4a42]/25 p-6 space-y-5"
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold tracking-[0.08em] uppercase text-on-surface-variant">
          Tool {String(index + 1).padStart(2, "0")}
        </span>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(tool.id)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#ffb4ab]/80 hover:text-[#ffb4ab] hover:bg-[#ffb4ab]/10 transition-all duration-200"
            aria-label="Remove tool"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Provider select */}
        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-on-surface">AI Provider</label>
          <div className="relative">
            <select
              value={tool.provider}
              onChange={(e) => onUpdate(tool.id, "provider", e.target.value)}
              className="w-full appearance-none bg-background border border-outline-variant/40 rounded-lg px-4 py-3 text-[14px] text-on-surface focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all pr-10 cursor-pointer"
            >
              {AI_PROVIDERS.map((p) => (
                <option key={p} value={p} className="bg-surface-container-low">
                  {p}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Monthly spend */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-on-surface">Monthly Spend</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[14px]">$</span>
              <input
                type="text"
                value={tool.monthlySpend}
                onChange={(e) => onUpdate(tool.id, "monthlySpend", e.target.value.replace(/[^0-9.]/g, ""))}
                placeholder="0.00"
                className="w-full bg-background border border-outline-variant/40 rounded-lg pl-7 pr-4 py-3 text-[14px] font-mono text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
              />
            </div>
          </div>

          {/* Seats */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-on-surface">Total Seats</label>
            <input
              type="number"
              value={tool.seats}
              onChange={(e) => onUpdate(tool.id, "seats", e.target.value)}
              placeholder="1"
              min="1"
              className="w-full bg-background border border-outline-variant/40 rounded-lg px-4 py-3 text-[14px] text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
            />
          </div>
        </div>

        {/* Use case */}
        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-on-surface">Primary Use Case</label>
          <div className="relative">
            <select
              value={tool.useCase}
              onChange={(e) => onUpdate(tool.id, "useCase", e.target.value)}
              className="w-full appearance-none bg-background border border-outline-variant/40 rounded-lg px-4 py-3 text-[14px] text-on-surface focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all pr-10 cursor-pointer"
            >
              {USE_CASES.map((u) => (
                <option key={u} value={u} className="bg-surface-container-low">
                  {u}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function EmptyToolSlot({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="w-full border-2 border-dashed border-[#3c4a42]/30 rounded-2xl flex flex-col items-center justify-center py-10 px-6 text-center hover:border-primary/40 hover:bg-primary/[0.02] transition-all duration-300 group"
    >
      <div className="w-11 h-11 rounded-full bg-surface-container-high border border-[#3c4a42]/30 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:border-primary/30 group-hover:bg-primary/10 transition-all duration-300">
        <Plus className="w-5 h-5 text-primary" />
      </div>
      <p className="text-[14px] font-semibold text-on-surface">Add another tool</p>
      <p className="text-[13px] text-on-surface-variant mt-1">Track multi-provider overlap</p>
    </motion.button>
  );
}

export default function AuditForm() {
  const router = useRouter();
  const [tools, setTools] = useState<ToolEntry[]>([{ id: "1", provider: "Cursor", monthlySpend: "", seats: "", useCase: "Software Engineering" }]);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [teamSize, setTeamSize] = useState(TEAM_SIZES[0]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [honeypot, setHoneypot] = useState(""); // Hidden anti-bot field

  useEffect(() => {
    try {
      const saved = localStorage.getItem("credex_audit_form");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.tools) setTools(parsed.tools);
        if (parsed.company) setCompany(parsed.company);
        if (parsed.role) setRole(parsed.role);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.teamSize) setTeamSize(parsed.teamSize);
      }
    } catch (e) {
      console.error("Failed to load form state", e);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("credex_audit_form", JSON.stringify({ tools, company, role, email, teamSize }));
  }, [tools, company, role, email, teamSize, isLoaded]);

  const addTool = () => {
    if (tools.length >= 6) return;
    setTools((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        provider: AI_PROVIDERS[prev.length % AI_PROVIDERS.length],
        monthlySpend: "",
        seats: "",
        useCase: USE_CASES[0],
      },
    ]);
  };

  const removeTool = (id: string) => {
    setTools((prev) => prev.filter((t) => t.id !== id));
  };

  const updateTool = (id: string, field: keyof ToolEntry, value: string) => {
    setTools((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    const hasSpend = tools.some((t) => t.monthlySpend && parseFloat(t.monthlySpend) > 0);
    if (!hasSpend) newErrors.tools = "Enter a monthly spend for at least one tool.";
    if (!company.trim()) newErrors.company = "Company name is required.";
    if (!role.trim()) newErrors.role = "Your role is required.";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Enter a valid work email address.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);

    try {
      // Run the audit engine client-side
      const { runAuditEngine } = await import("@/lib/auditEngine");
      const auditResult = runAuditEngine(tools, teamSize);

      // Store audit result for the dashboard page
      localStorage.setItem(
        "credex_audit_result",
        JSON.stringify(auditResult)
      );

      // Submit lead to the API
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          company,
          role,
          teamSize,
          website: honeypot, // honeypot field
          auditData: {
            tools,
            totalCurrentSpend: auditResult.totalCurrentSpend,
            totalMonthlySavings: auditResult.totalMonthlySavings,
            totalAnnualSavings: auditResult.totalAnnualSavings,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.id) {
          localStorage.setItem("credex_last_audit_id", data.id);
        }
      } else {
        // Fallback ID if API fails (e.g., no supabase configured)
        const fallbackId = `audit_local_${Date.now()}`;
        localStorage.setItem("credex_last_audit_id", fallbackId);
      }
    } catch (err) {
      console.error("Submission error:", err);
      // Even if the API call fails, still redirect to dashboard
      // since audit runs client-side
      const fallbackId = `audit_local_${Date.now()}`;
      localStorage.setItem("credex_last_audit_id", fallbackId);
    }

    setIsSubmitting(false);
    setSubmitted(true);
    setTimeout(() => router.push("/dashboard"), 1000);
  };

  return (
    <section
      id="audit-form"
      className="bg-surface-container-low py-[80px] relative overflow-hidden"
    >
      {/* ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="ambient-orb w-[600px] h-[600px] bg-primary/5 left-1/2 -translate-x-1/2 top-0" />
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-semibold tracking-[0.08em] uppercase mb-5"
          >
            Free Intelligence Audit
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[32px] md:text-[40px] font-semibold tracking-[-0.02em] mb-4"
          >
            Start Your AI Spend Audit
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-on-surface-variant max-w-xl mx-auto text-[16px] leading-relaxed"
          >
            Input your current AI stack and receive an instant projection of consolidation
            and cost-reduction opportunities — no credit card required.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl mx-auto"
        >
          <form
            onSubmit={handleSubmit}
            noValidate
            className="glass-card rounded-[28px] p-8 md:p-12 shadow-[0_24px_80px_rgba(0,0,0,0.5)]"
          >
            {/* STEP 1: Tools */}
            <div className="mb-10">
              <h3 className="text-[11px] font-semibold tracking-[0.08em] uppercase text-on-surface-variant mb-6">
                Step 1 — Your AI Stack
              </h3>

              <AnimatePresence mode="popLayout">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {tools.map((tool, index) => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      index={index}
                      onUpdate={updateTool}
                      onRemove={removeTool}
                      canRemove={tools.length > 1}
                    />
                  ))}
                  {tools.length < 6 && (
                    <EmptyToolSlot onClick={addTool} />
                  )}
                </div>
              </AnimatePresence>

              {errors.tools && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-3 text-[13px] text-[#ffb4ab]"
                >
                  {errors.tools}
                </motion.p>
              )}
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-[#3c4a42]/40 to-transparent mb-10" />

            {/* STEP 2: Contact */}
            <div className="mb-10">
              <h3 className="text-[11px] font-semibold tracking-[0.08em] uppercase text-on-surface-variant mb-6">
                Step 2 — Secure Delivery
              </h3>
              <p className="text-[14px] text-on-surface-variant mb-6 -mt-2">
                We&apos;ll send your customized intelligence report directly to your work email.
              </p>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-on-surface">Company Name</label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => { setCompany(e.target.value); setErrors((p) => ({ ...p, company: undefined })); }}
                      placeholder="Acme Corp"
                      className={cn(
                        "w-full bg-background border rounded-lg px-4 py-3 text-[14px] text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none transition-all",
                        errors.company
                          ? "border-[#ffb4ab]/60 focus:border-[#ffb4ab] focus:ring-1 focus:ring-[#ffb4ab]/30"
                          : "border-[#3c4a42]/40 focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
                      )}
                    />
                    {errors.company && <p className="text-[12px] text-[#ffb4ab]">{errors.company}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-on-surface">Your Role</label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => { setRole(e.target.value); setErrors((p) => ({ ...p, role: undefined })); }}
                      placeholder="CTO, CFO, Procurement Lead…"
                      className={cn(
                        "w-full bg-background border rounded-lg px-4 py-3 text-[14px] text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none transition-all",
                        errors.role
                          ? "border-[#ffb4ab]/60 focus:border-[#ffb4ab] focus:ring-1 focus:ring-[#ffb4ab]/30"
                          : "border-[#3c4a42]/40 focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
                      )}
                    />
                    {errors.role && <p className="text-[12px] text-[#ffb4ab]">{errors.role}</p>}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-on-surface">Work Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
                    placeholder="you@company.com"
                    className={cn(
                      "w-full bg-background border rounded-lg px-4 py-3 text-[14px] text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none transition-all",
                      errors.email
                        ? "border-[#ffb4ab]/60 focus:border-[#ffb4ab] focus:ring-1 focus:ring-[#ffb4ab]/30"
                        : "border-[#3c4a42]/40 focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
                    )}
                  />
                  {errors.email && <p className="text-[12px] text-[#ffb4ab]">{errors.email}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-on-surface">Team Size</label>
                  <div className="flex flex-wrap gap-3">
                    {TEAM_SIZES.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setTeamSize(size)}
                        className={cn(
                          "px-4 py-2 rounded-lg text-[13px] font-medium border transition-all duration-200",
                          teamSize === size
                            ? "bg-primary/15 border-primary/50 text-primary"
                            : "bg-transparent border-[#3c4a42]/40 text-on-surface-variant hover:border-primary/30 hover:text-on-surface"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Honeypot — hidden field for bot detection */}
            <div className="absolute -left-[9999px]" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input
                type="text"
                id="website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isSubmitting || submitted}
              whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
              className={cn(
                "w-full py-5 rounded-xl text-[16px] font-bold flex items-center justify-center gap-3 transition-all duration-300",
                submitted
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "bg-primary text-background shadow-[0_0_24px_rgba(78,222,163,0.3)] hover:shadow-[0_0_40px_rgba(78,222,163,0.45)]"
              )}
            >
              {submitted ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Audit Complete — Redirecting…
                </>
              ) : isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Running Intelligence Audit…
                </>
              ) : (
                <>
                  Get Full Intelligence Report
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>

            <p className="text-center text-[11px] text-on-surface-variant mt-4 flex items-center justify-center gap-1.5">
              <Lock className="w-3 h-3" />
              Enterprise-grade encryption · SOC-2 Type II · No credit card required
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
