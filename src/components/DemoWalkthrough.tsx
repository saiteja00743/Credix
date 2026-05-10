"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, Sparkles, ArrowRight } from "lucide-react";

export default function DemoWalkthrough() {
  const [isOpen, setIsOpen] = useState(false);

  const triggerDemo = () => {
    // Scroll to form
    const formEl = document.getElementById("audit-form");
    if (formEl) {
      formEl.scrollIntoView({ behavior: "smooth" });
    }

    // Wait a bit, then auto-fill the form with a sample stack
    setTimeout(() => {
      const demoState = {
        tools: [
          { id: "1", provider: "ChatGPT", plan: "Team", monthlySpend: "4000", seats: "80", useCase: "Software Engineering" },
          { id: "2", provider: "Claude", plan: "Team", monthlySpend: "1200", seats: "40", useCase: "Research & Writing" },
          { id: "3", provider: "GitHub Copilot", plan: "Enterprise", monthlySpend: "1560", seats: "40", useCase: "Software Engineering" },
          { id: "4", provider: "Midjourney", plan: "Pro", monthlySpend: "300", seats: "5", useCase: "Marketing / Creative" },
        ],
        company: "Acme Corp (Demo)",
        role: "Head of Engineering",
        email: "demo@acmecorp.com",
        teamSize: "51–250",
      };

      localStorage.setItem("credex_audit_form", JSON.stringify(demoState));
      
      // Dispatch a custom event or simply reload to let the form pick it up
      // In this demo, reloading is the most robust way to trigger the re-render with local storage, 
      // but clicking submit will just use the pre-filled values!
      window.location.reload();
    }, 800);
  };

  return (
    <>
      {/* Floating trigger button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200, damping: 20 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center gap-2 bg-background text-on-surface border border-primary/30 shadow-[0_0_24px_rgba(78,222,163,0.15)] hover:border-primary/60 hover:shadow-[0_0_32px_rgba(78,222,163,0.3)] transition-all px-4 py-3 rounded-full group overflow-hidden"
      >
        <div className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
        <div className="relative z-10 flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-background">
            <Play className="w-3.5 h-3.5 ml-0.5" />
          </div>
          <span className="text-[13px] font-bold tracking-tight">Run Demo</span>
        </div>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-surface-container-low border border-[#3c4a42]/30 rounded-3xl p-8 z-[101] shadow-2xl"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface-variant"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-12 h-12 bg-primary/10 rounded-full border border-primary/20 flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>

              <h2 className="text-[22px] font-semibold mb-3">Interactive Demo</h2>
              <p className="text-[14px] text-on-surface-variant leading-relaxed mb-8">
                Want to see Credex in action? This demo will automatically populate the audit form with a sample 4-tool AI stack (ChatGPT, Claude, Copilot, Midjourney) so you can instantly see the generated dashboard and recommendations.
              </p>

              <button
                onClick={triggerDemo}
                className="w-full flex items-center justify-center gap-2 bg-primary text-background font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(78,222,163,0.25)] hover:shadow-[0_0_32px_rgba(78,222,163,0.4)] transition-shadow"
              >
                Auto-fill & Run Demo
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
