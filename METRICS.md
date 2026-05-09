# METRICS.md

## North Star Metric

**Qualified audits completed per week** — defined as an audit where the user inputs ≥2 tools and provides a valid work email.

### Why this and not something else

- **Not "page visits"**: A user who bounces from the landing page delivers zero value to Credex or to themselves.
- **Not "leads captured"**: Leads without an audit completed have no dollar figure attached — they're not qualified.
- **Not "revenue"**: Too lagging for a week-1 tool. We need a metric that tells us if the product is working *today*.

A "qualified audit" is the moment value is delivered: the user sees their savings number, has given us their email, and has a shareable report link. From this moment, a Credex consultation CTA is surfaced. The North Star captures the full top-of-funnel motion in one number.

**Target for week 1 of a public launch:** 100 qualified audits/week.

---

## 3 Input Metrics That Drive the North Star

| Input Metric | Why It Matters | What Moves It |
|---|---|---|
| **Landing page → form start rate** | If people see the page but don't start the form, the hero copy or trust signals are failing | A/B test headlines, add social proof logos, reduce page load time |
| **Form start → form completion rate** | Measures friction inside the multi-tool input form | Reduce required fields, improve inline validation UX, add the "Run Demo" auto-fill |
| **Form completion → email submit rate** | Captures lead hesitation at the gate moment | Reframe email ask as "to send your report", not "to sign up" — copy matters enormously here |

---

## What We'd Instrument First

**Day 1 instrumentation (in priority order):**

1. `audit_started` — fires when a user adds their first tool row
2. `audit_completed` — fires when the engine runs and the dashboard renders
3. `lead_captured` — fires on successful email submission (fires `audit_id` as a property)
4. `report_shared` — fires when a user copies their shareable link

**Implementation:** All four events go to [PostHog](https://posthog.com/) (free tier, self-hostable, no PII by default).

**The one funnel we watch daily:**
```
page_view → audit_started → audit_completed → lead_captured → report_shared
```

Any drop > 30% between two consecutive steps is an immediate investigation trigger.

---

## Pivot Decision Trigger

**If, after 500 qualified audits, fewer than 3% book a Credex consultation** → the tool is delivering value but not converting it into Credex's business. This means the CTA timing, offer framing, or consultation experience needs a fundamental rethink — not the audit tool itself.

**If, after 200 qualified audits, average identified savings < $500/month** → the tool is targeting the wrong user (too small). Shift GTM to Series A+ companies with ≥20 AI seats before investing in growth.

**Healthy leading indicator:** If >15% of report links are opened by someone other than the original user (tracked via `report_shared` vs. unique `report_opened` events), viral shareability is working and distribution spend is justified.
