# TESTS.md

## Test Framework

**Framework:** [Vitest](https://vitest.dev/) — chosen for native TypeScript support and zero-config setup with the existing Vite/Next.js ecosystem.

**Run command:**
```bash
npm test
```

**Run with coverage:**
```bash
npm run test:coverage
```

---

## Test Files

### `tests/auditEngine.test.ts`

Covers the core business logic of the spend audit engine (`src/lib/auditEngine.ts`). This is the most critical module — if the recommendations are wrong, the entire product is wrong.

| # | Test Name | What It Covers |
|---|---|---|
| 1 | Correctly sums totalCurrentSpend | Verifies that multi-tool spend is accurately aggregated |
| 2 | Annual savings = 12x monthly | Validates the annualization formula |
| 3 | ChatGPT high-cost-per-seat triggers downgrade | Checks the `>$25/seat` pricing threshold for OpenAI Team |
| 4 | Cursor + Copilot overlap → consolidation | Detects duplicate AI code assistant spending |
| 5 | ChatGPT + Claude overlap → LLM redundancy | Detects duplicate general-purpose LLM spending |
| 6 | Optimal stack → zero savings | Confirms no false positives for well-priced tools |
| 7 | Copilot Enterprise → downgrade to Business | Validates the $39→$19/seat recommendation ($200 savings on 10 seats) |
| 8 | High API spend → credits recommendation | Confirms credits pathway triggers above $500/mo |
| 9 | Empty tools array → graceful handling | Regression guard against divide-by-zero on empty input |
| 10 | Midjourney Pro → downgrade to Standard | Validates the $60→$30 single-user downgrade recommendation |

**Result:** ✅ 10/10 passing

---

## CI Integration

Tests run automatically on every push to `main` via GitHub Actions (`.github/workflows/ci.yml`).
The workflow gate order is: **lint → typecheck → test → build**.
A failing test blocks the build step from running.
