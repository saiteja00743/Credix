# Development Log

## Day 1 — 2026-05-06
**Hours worked:** 0
**What I did:** Received the assignment brief. Read requirements thoroughly and analyzed evaluation rubric. Mapped out all 6 MVP features and identified key deliverables.
**What I learned:** The emphasis is on defensible audit logic and real pricing data — not just a pretty UI. Each number must trace to an official pricing page URL.
**Blockers / what I'm stuck on:** N/A — planning day.
**Plan for tomorrow:** Set up the Next.js project scaffold, design system, and core component architecture.

## Day 2 — 2026-05-07
**Hours worked:** 8
**What I did:** Scaffolded the entire Next.js 16 project with TypeScript, Tailwind v4, Framer Motion, and Radix UI. Built the landing page (HeroSection, FeaturesGrid, FAQ, Footer), the AuditForm with localStorage persistence, the audit engine with rule-based recommendations, and the dashboard results page with animated metrics and ToolBreakdown table.
**What I learned:** Tailwind v4's `@theme` architecture is significantly different from v3 — no more `tailwind.config.js`. All design tokens go directly into the CSS file. The new approach is cleaner but required reading the migration guide carefully.
**Blockers / what I'm stuck on:** The audit engine currently only supports 6 providers. Need to expand coverage for Cursor plan tiers and add Gemini/Windsurf.
**Plan for tomorrow:** Integrate the Anthropic API for the AI-generated personalized summary, fix lint errors, and set up CI pipeline.

## Day 3 — 2026-05-08
**Hours worked:** 6
**What I did:** Integrated Anthropic Claude API for AI-generated personalized summaries with graceful fallback. Created the API route (`/api/summary`) with error handling. Set up environment variables securely. Updated PRICING_DATA.md with official vendor URLs and verification dates. Created PROMPTS.md documenting the full LLM prompt. Fixed all ESLint errors and pushed CI green.
**What I learned:** The Anthropic SDK handles rate limits (429) with automatic retries, but you still need a manual fallback for network failures or when the API key isn't set. The fallback template approach ensures the tool always delivers value even if the AI layer is down.
**Blockers / what I'm stuck on:** Need to decide on database provider — Supabase vs. Cloudflare D1. Supabase has better DX but D1 is closer to the edge.
**Plan for tomorrow:** Set up Supabase for lead capture and audit persistence. Build the transactional email flow with Resend.

## Day 4 — 2026-05-09
**Hours worked:** 6
**What I did:** Created the Supabase database schema (`leads` and `audits` tables) with RLS policies. Integrated the Resend API for transactional confirmation emails with a custom HTML template. Built the public-facing shareable report page (`/report/[id]`) that fetches from Supabase to provide dynamic Open Graph metadata for social sharing. Updated the dashboard to capture and use the real audit ID.
**What I learned:** Building a zero-friction lead capture flow requires gracefully handling failure. If the database or email API fails, the user still gets their audit report locally. Also, dynamic Open Graph images/metadata in Next.js 16 requires server-side fetching, but the actual client page can gracefully fallback to localStorage if DB data is missing or the link is opened by the original author.
**Blockers / what I'm stuck on:** Need to set up Supabase tables in the actual cloud project, currently using a local migration file for the schema.
**Plan for tomorrow:** Finalize the polished interactive features, add a floating demo/walkthrough, and ensure all ESLint errors are resolved for the final handoff.

## Day 5 — 2026-05-10
**Hours worked:** 8
**What I did:** Refined the Audit Form and Engine to strictly follow the rubric requirements. Added an explicit "Plan" selection for each AI tool and updated the provider list. Updated the audit engine logic to use these explicit plans for more defensible and accurate savings recommendations. **Implemented Benchmark Mode (Bonus Feature)**: Users can now see how their AI spend per developer compares against industry averages for their specific company stage (Seed vs. Growth vs. Enterprise). Built a global `DemoWalkthrough` widget that auto-fills the form with a sample stack. Fixed ESLint warnings.
**What I learned:** Benchmarking adds a psychological layer to the audit. Even if a company is "efficient" by their own standards, seeing that they are in the 30th percentile compared to peers creates a much stronger incentive for them to explore Credex's negotiation services.
**Blockers / what I'm stuck on:** None.
**Plan for tomorrow:** Final code review, update README with new architecture details, and prepare for Vercel deployment.
