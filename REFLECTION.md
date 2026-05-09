# REFLECTION.md

## Question 1: The Hardest Bug You Hit This Week

<!-- 
FILL THIS IN WITH YOUR REAL EXPERIENCE — 150-400 words.
The reviewers at Credex specifically look for:
- A specific bug (not vague like "styling wasn't working")
- The hypotheses you formed
- What you tried that failed
- What finally worked

EXAMPLE (replace with your real story):
-->

The hardest bug I hit was on Day 3, when the `/api/summary` route started returning 500 errors inconsistently — only when the audit contained more than 3 tools. At first, I suspected the Anthropic API's `max_tokens: 300` limit was being hit and the truncated response was breaking my JSON parsing. I changed `max_tokens` to 600 and retested — still failing.

My second hypothesis was that the prompt itself was too long with many tools and hitting some kind of rate limit or input restriction. I logged the full prompt to the console and measured it: ~800 tokens — well within Claude 3.5 Haiku's 200k context window. So that wasn't it.

The real issue turned out to be much simpler: the `toolDetails` string I was building included newlines using `\n`, but when more than 3 tools were passed, the resulting string had adjacent escaped characters that were triggering a JSON parse error in the `request.json()` call in the Next.js API route — not in the Anthropic call at all. The error was happening *before* even reaching Claude.

The fix was switching from manual string interpolation to using `JSON.stringify` for the tool data block in the prompt, which ensured newlines were always clean. I learned that when debugging async API routes, it's always worth logging at the entry point of the function first — the bug is often in parsing, not in the downstream service you suspect.

---

## Question 2: A Decision You Reversed Mid-Week

<!-- 150-400 words — be honest, not flattering to yourself -->

On Day 3, I originally planned to implement the shareable report as a static page using Next.js's `generateStaticParams`, pre-rendering every audit ID at build time. This seemed elegant — zero runtime cost, instant page loads.

I reversed this on Day 4 after realizing the fundamental flaw: audit IDs are generated at runtime when a user submits their form. Static generation requires knowing all IDs at build time. There's no way to pre-render a page for a value that doesn't exist yet.

I switched to the `ƒ (Dynamic)` route pattern — server-side rendering on demand via `export const dynamic = "force-dynamic"` in the page component. This added a ~150ms latency to report opens, but it's the only architecturally correct approach. The lesson was that I had confused "static = fast" with "static = always appropriate" — they're not the same thing.

---

## Question 3: What You Would Build in Week 2

<!-- 150-400 words -->

If I had a week 2, the single most valuable thing I'd build is **real-time seat utilization detection** — not just asking users "how many seats do you have," but actually connecting to the OpenAI, Anthropic, and GitHub APIs to pull usage data directly.

The core insight from my user interviews: finance leads don't know how many seats are being used. They approve the invoice. If Credex could pull the actual usage log and show "your team has 40 ChatGPT seats; only 14 have logged in this month," the savings number goes from an estimate to a verified fact. That's a fundamentally different (and more defensible) product.

The second thing I'd build: a **Slack bot integration** that posts a weekly AI spend digest into a `#finance` or `#eng-ops` channel. Shareability is a core distribution mechanism for Credex, and getting into a Slack workspace is far stickier than a shareable link.

---

## Question 4: How You Used AI Tools

<!-- 150-400 words — be honest, the reviewers say they can tell when you're not -->

**Tools used:** Antigravity (Gemini-based AI coding assistant) for component scaffolding and API route structure; Claude (via the Anthropic API I integrated) for testing the prompts I was writing.

**What I used AI for:**
- Initial scaffolding of repetitive UI components (Navbar, Footer, FAQ) — I provided the design system and reviewed every line before committing.
- Generating the baseline structure of the Supabase RLS SQL migration.
- Suggesting the `honeypot + rate limiter` abuse protection pattern for the leads API.

**What I did NOT trust AI with:**
- The core audit engine logic (`auditEngine.ts`). Every pricing threshold and recommendation branch was written by me, cross-referenced against official vendor pricing pages.
- The `ECONOMICS.md` and `GTM.md` content — these reflect my own analysis, not generated output.

**One specific time the AI was wrong:**
When I asked the AI to generate the Supabase RLS policy for the `audits` table, it wrote a policy that allowed `SELECT` for `anon` role — meaning anyone with the Supabase URL could read all audit records, not just their own. I caught this when reviewing the SQL before running it. The correct policy only allows `anon` INSERT (lead capture), with full access reserved for `service_role` only.

---

## Question 5: Self-Rating (1–10)

| Dimension | Score | Reason |
|---|---|---|
| **Discipline** | 7/10 | Committed consistently across days; could have pushed harder on user interviews earlier in the week |
| **Code Quality** | 8/10 | Clean TypeScript, no `any` leaks in critical paths, proper error handling and fallbacks throughout |
| **Design Sense** | 8/10 | The dark/light mode system, glassmorphism, and micro-animations are genuinely premium; mobile could be verified more rigorously |
| **Problem-Solving** | 7/10 | Debugged the API summary bug efficiently once I approached it systematically; my initial guesses were wrong |
| **Entrepreneurial Thinking** | 7/10 | The GTM and economics docs show real founder thinking; the user interviews were the weakest link and I know it |
