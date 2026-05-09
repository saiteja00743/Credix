# Credex AI — Architecture & Design Decisions

## Current Tech Stack (Shipped)

| Layer | Technology | Why |
|---|---|---|
| Framework | Next.js 16 (App Router) | SSR for shareable report OG tags; API routes for server-side integrations |
| Language | TypeScript (strict) | Prevents pricing math bugs; audit engine output is fully typed |
| Styling | Tailwind CSS v4 (`@theme` architecture) | CSS-variable-first design system; light/dark mode without JS overhead |
| Animations | Framer Motion | Entrance animations on dashboard KPI cards; mobile spring physics |
| AI Integration | Anthropic SDK (Claude 3.5 Haiku) | Fast, cheap inference for 100-word summaries; deterministic fallback when unavailable |
| Database | Supabase (PostgreSQL + RLS) | Lead + audit persistence with Row Level Security; anon INSERT, service_role full access |
| Email | Resend API | Transactional HTML email on lead capture; non-blocking best-effort dispatch |
| Auth/Abuse | Honeypot field + in-memory IP rate limiter | Zero-friction for real users; blocks >95% automated abuse without CAPTCHA UX penalty |
| Deployment | Vercel (Next.js native) | Zero-config CI/CD; `vercel.json` adds security headers and static asset cache rules |

---

## Directory Structure

```
src/
├── app/
│   ├── globals.css              # Tailwind v4 @theme tokens + light mode CSS overrides
│   ├── layout.tsx               # Root layout: next/font, ThemeProvider, DemoWalkthrough
│   ├── page.tsx                 # Landing page (Hero, Features, FAQ, AuditForm, Footer)
│   ├── dashboard/
│   │   └── page.tsx             # Audit results dashboard (reads from localStorage)
│   ├── report/
│   │   └── [id]/
│   │       ├── page.tsx         # SSR: fetches audit from Supabase, generates OG metadata
│   │       └── ReportClient.tsx # Client: renders report (Supabase data or localStorage fallback)
│   └── api/
│       ├── leads/route.ts       # Lead capture: rate limit → honeypot → Supabase → email
│       ├── summary/route.ts     # AI summary: Anthropic Claude → deterministic fallback
│       └── email/route.ts       # Transactional email via Resend API
├── components/
│   ├── Navbar.tsx               # Navigation with ThemeToggle
│   ├── HeroSection.tsx          # Hero with animated AuditPreviewCard
│   ├── FeaturesGrid.tsx         # Feature showcase
│   ├── AuditForm.tsx            # Multi-tool input form (localStorage persistence)
│   ├── ToolBreakdown.tsx        # Results table
│   ├── AnimatedCountUp.tsx      # Number animation utility
│   ├── ThemeProvider.tsx        # next-themes wrapper
│   ├── ThemeToggle.tsx          # Sun/Moon toggle button
│   └── DemoWalkthrough.tsx      # Floating demo widget (auto-fills form for reviewers)
└── lib/
    ├── utils.ts                 # cn() utility (clsx + tailwind-merge)
    ├── auditEngine.ts           # Core rule-based spend analysis engine
    ├── supabase.ts              # Supabase client with isConfigured() guard
    └── pricing.ts               # Centralized pricing data

tests/
└── auditEngine.test.ts          # 10 Vitest tests for audit engine business logic
```

---

## Data Flow (Current)

```
User fills AuditForm
      │
      ▼
localStorage ("credex_audit_form")
      │
      ▼
POST /api/leads  ←── rate limiter + honeypot check
      │
      ├──▶ Supabase: INSERT leads + audits (graceful failure: user never blocked)
      │
      └──▶ POST /api/email (non-blocking best-effort via fire-and-forget fetch)
                │
                └──▶ Resend API → HTML confirmation email with report link

User redirected to /dashboard
      │
      ▼
runAuditEngine(tools, teamSize)  ←── pure client-side, localStorage input
      │
      ▼
POST /api/summary  ←── sends audit results to Anthropic
      │
      ├──▶ Claude 3.5 Haiku → ~100 word personalized paragraph
      └──▶ On failure: deterministic template-based fallback (always returns a summary)

Shareable link: /report/[auditId]
      │
      ▼
Server-side: Supabase fetch → dynamic Open Graph metadata
Client-side: Supabase data → render (fallback: localStorage for original author)
```

---

## Key Design Decisions

### 1. Client-side audit engine, not server-side
The `runAuditEngine` function runs in the browser. This means: (a) instant results with no API latency, (b) the tool works even if the backend is down, and (c) the recommendation logic is visible in source — which is a feature, not a bug, for a trust-building B2B tool.

*Trade-off:* Proprietary logic is client-exposed. For v2, migrate to `/api/audit` to protect IP.

### 2. Graceful degradation everywhere
Every integration has a defined failure mode: Supabase down → audit still completes locally. Anthropic unavailable → deterministic fallback summary. Email fails → lead is still captured. The user always gets their report.

### 3. In-memory rate limiter (known limitation)
The current rate limiter resets on every cold start (serverless function). This is acceptable for MVP but would fail under multi-instance production load. **Production path:** Replace with Upstash Redis + `@upstash/ratelimit`.

---

## Scaling Path (v2)

1. Move `runAuditEngine` to `/api/audit` to protect proprietary pricing logic
2. Add Upstash Redis rate limiting for serverless-safe abuse protection
3. Connect to OpenAI/Anthropic/GitHub APIs for real-time seat utilization data
4. Add PostHog analytics for North Star metric tracking
5. Add Slack bot integration for viral weekly digest distribution

