# <img src="src/app/icon.png" width="32" height="32" valign="middle" /> Credex AI: Spend Audit Platform

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)

**Credex AI** is a premium, high-conversion lead generation engine designed for the AI era. It helps startups and enterprises identify wasted spend on AI subscriptions (Cursor, Claude, ChatGPT, etc.) and offers defensible, data-driven optimization strategies.

---

### 🔗 Project Links
- **Live Production URL:** [https://credix-nu.vercel.app/](https://credix-nu.vercel.app/)
- **GitHub Repository:** [https://github.com/saiteja00743/Credix](https://github.com/saiteja00743/Credix)
- **Demo Walkthrough:** [30-Second Video](https://credix-nu.vercel.app/) <!-- Link your demo video here -->

---

### 🚀 Key Features

#### 🧠 Dynamic Audit Engine
A deterministic, rule-based engine that evaluates user stacks against real-world pricing data. It identifies plan mismatches (e.g., 2 users on a 5-seat minimum Team plan) and suggests consolidation opportunities.

#### ⚡ AI-Powered Summaries
Integrated with **Anthropic Claude 3.5 Sonnet** to generate narrative, executive-ready summaries of potential savings. Features a zero-latency fallback system for 100% uptime.

#### 📈 Benchmark Mode
Allows users to compare their AI spend per developer against industry averages for Seed, Growth, and Enterprise stages, creating a compelling psychological hook for Credex's services.

#### 🔗 Viral Shareability
Dynamic `/report/[id]` routes with custom-generated Open Graph metadata for high-quality previews on Twitter, Slack, and LinkedIn.

---

### 🛠️ Tech Stack

- **Frontend:** Next.js 15 (App Router), React 19
- **Styling:** Tailwind CSS v4, Framer Motion (Animations), Radix UI (Primitives)
- **Backend:** Supabase (Auth, DB, RLS), Next.js API Routes
- **Integrations:** Anthropic API (AI), Resend API (Transactional Email)
- **Infrastructure:** Vercel (Deployment), GitHub Actions (CI/CD)

---

### 📖 Documentation Index

| File | Purpose |
|---|---|
| [`DEVLOG.md`](./DEVLOG.md) | Day-by-day journal of the 7-day build cycle. |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | System design, data flow, and scalability plan. |
| [`REFLECTION.md`](./REFLECTION.md) | Technical post-mortem, bug reports, and AI usage disclosure. |
| [`ECONOMICS.md`](./ECONOMICS.md) | Unit economics, CAC analysis, and revenue modeling. |
| [`GTM.md`](./GTM.md) | Go-To-Market strategy and distribution channels. |
| [`USER_INTERVIEWS.md`](./USER_INTERVIEWS.md) | Insights from discovery calls with real users. |
| [`PRICING_DATA.md`](./PRICING_DATA.md) | Verified source of truth for all audit logic pricing. |
| [`PROMPTS.md`](./PROMPTS.md) | Full LLM prompts and iteration history. |
| [`TESTS.md`](./TESTS.md) | Automated test suite documentation and coverage. |

---

### 🏗️ Engineering Decisions

- **Why Tailwind v4?** Utilized the new `@theme` architecture to centralize design tokens directly in CSS, reducing configuration overhead.
- **Why Supabase?** Rapid iteration speed and built-in Row Level Security (RLS) allowed for a secure, production-ready backend within the 7-day sprint.
- **Deterministic Logic:** Chose hardcoded rules for the audit math over LLM-based calculations to ensure financial accuracy and defensibility.

---

### ⚡ Quick Start

1. **Clone & Install:**
   ```bash
   git clone https://github.com/saiteja00743/Credix.git
   cd Credix
   npm install
   ```
2. **Environment Setup:**
   Create a `.env` file based on `.env.example`:
   `ANTHROPIC_API_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `RESEND_API_KEY`
3. **Run Dev Server:**
   ```bash
   npm run dev
   ```
4. **Run Tests:**
   ```bash
   npm test
   ```

---

*Built with passion for the Credex Intern Assignment — Round 1.*
