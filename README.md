# Credex AI Spend Audit Platform

Credex AI is a premium B2B SaaS landing page and dashboard designed to help startup founders, CFOs, and engineering managers identify and eliminate wasted spend on enterprise AI tools (like ChatGPT Plus, Anthropic API, GitHub Copilot, etc.). 

This application functions as a highly-polished lead generation engine, utilizing an interactive "AI Spend Audit" form to immediately calculate and display ROI to prospective clients.

## Features
- **Dynamic Spend Audit Engine:** A rule-based engine that evaluates user inputs against real-world pricing data to recommend downgrades, consolidations, or infrastructure credits.
- **AI-Powered Insights:** Uses the **Anthropic Claude API** to generate personalized, narrative summaries of the user's stack and potential savings, complete with a graceful local fallback.
- **Zero-Friction Lead Capture:** Persists leads and full audit data to **Supabase**. Even if DB connection fails, users immediately receive their client-side audit results.
- **Transactional Email Flow:** Automatically fires a polished HTML confirmation email via **Resend**, containing the user's customized savings report.
- **Shareable Reports with OG Tags:** Dynamically generates `/report/[id]` URLs. These routes use server-side fetching (SSR) to render custom Open Graph metadata, ensuring social media and Slack shares look incredible.
- **Premium UI/UX:** Built with a "Silicon Valley" startup aesthetic. Features dark mode, glassmorphism, glowing radial gradients, scroll-triggered micro-animations, and an interactive **Floating Demo Widget** for recruiters.
- **Tailwind CSS v4:** Built using the bleeding-edge Tailwind v4 architecture (`@theme` directly in CSS).

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **UI:** React 19, Tailwind CSS v4, Radix UI
- **Animations:** Framer Motion
- **AI Integration:** Anthropic SDK (Claude 3.5 Sonnet)
- **Database:** Supabase (PostgreSQL with RLS)
- **Email:** Resend API

## Getting Started

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables. Copy `.env.example` to `.env` and fill in your keys:
   ```bash
   cp .env.example .env
   ```
   *(Required keys: `ANTHROPIC_API_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `RESEND_API_KEY`, `NEXT_PUBLIC_BASE_URL`)*
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Documentation
To understand the business rationale and architectural decisions behind this product, please review the following documents:
- `DEVLOG.md`: A day-by-day journal of the entire 7-day development cycle.
- `ARCHITECTURE.md`: Current system architecture, data flow, and design decisions.
- `REFLECTION.md`: Honest post-mortem — hardest bugs, reversed decisions, and AI tool usage.
- `ECONOMICS.md`: Unit economics, revenue model, and path to $1M ARR.
- `GTM.md`: Go-To-Market strategy, distribution channels, and first-100-users plan.
- `USER_INTERVIEWS.md`: Notes from user discovery conversations.
- `PRICING_DATA.md`: The single source of truth for the audit engine's logic (with vendor URLs).
- `PROMPTS.md`: The LLM prompts used for AI summaries — including what didn't work.
- `LANDING_COPY.md`: Production-ready marketing copy for the landing page.
- `METRICS.md`: North Star metric, input metrics, and pivot decision triggers.
- `TESTS.md`: All automated tests, what they cover, and how to run them.

## Key Decisions

### Why next-themes over a custom dark mode solution?
`next-themes` handles the SSR/hydration flash problem correctly out of the box via `suppressHydrationWarning` on the `<html>` element. A custom solution would have required the same approach anyway, plus additional state management.

### Why Supabase over Cloudflare D1?
Supabase has better DX for a 7-day sprint: a hosted GUI, instant RLS policy UI, and a JavaScript client with TypeScript types auto-generated from the schema. D1 is closer to the edge and cheaper at scale, but the operational overhead of setting up Wrangler and migrations in a time-constrained build wasn't justified.

### Why a deterministic fallback for the AI summary instead of retrying?
Retrying the Anthropic API on failure adds latency and risks blocking the user's dashboard render. A deterministic fallback that uses the same audit data produces a meaningful, accurate summary without any round-trip. Users can't tell the difference in quality for a 100-word paragraph.

### Why in-memory rate limiting instead of Redis?
A serverless-safe Redis rate limiter (Upstash) requires provisioning another external service, environment variable setup, and SDK integration. For a 7-day MVP where the risk of abuse is low, in-memory limiting covers the >95% of bot traffic from a single origin. The comment in the code explicitly documents the production upgrade path.

## Running Tests
```bash
npm test
```
Tests cover the core `auditEngine.ts` business logic with 10 assertions. See `TESTS.md` for details.
