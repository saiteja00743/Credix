import { describe, it, expect } from "vitest";
import { runAuditEngine, ToolEntry } from "../src/lib/auditEngine";

// ─── Helpers ─────────────────────────────────────────────────────────────────
function tool(
  provider: string,
  plan: string,
  monthlySpend: string,
  seats: string,
  useCase = "General Purpose"
): ToolEntry {
  return { id: crypto.randomUUID(), provider, plan, monthlySpend, seats, useCase };
}

// ─── Test Suite ───────────────────────────────────────────────────────────────
describe("runAuditEngine", () => {
  // 1 ─ Baseline math
  it("correctly sums totalCurrentSpend across all tools", () => {
    const result = runAuditEngine(
      [tool("ChatGPT", "Team", "500", "10"), tool("Midjourney", "Basic", "30", "1")],
      "11–50"
    );
    expect(result.totalCurrentSpend).toBe(530);
  });

  // 2 ─ Annual savings = 12x monthly
  it("calculates totalAnnualSavings as 12x totalMonthlySavings", () => {
    const result = runAuditEngine(
      [tool("GitHub Copilot", "Enterprise", "390", "10")], // $39/seat → downgrade to $19 saves $200
      "11–50"
    );
    expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12);
  });

  // 3 ─ ChatGPT Team plan optimization (switch to Pro)
  it("flags ChatGPT Team for small teams when seats < 3", () => {
    // 2 seats, $60/mo → should trigger optimize action
    const result = runAuditEngine(
      [tool("ChatGPT", "Team", "60", "2")],
      "1–10"
    );
    const rec = result.toolResults[0].recommendation;
    expect(rec.type).toBe("downgrade");
    expect(rec.savings).toBeGreaterThan(0);
  });

  // 4 ─ Cursor + Copilot overlap triggers consolidation
  it("detects redundancy when Cursor and GitHub Copilot are both in the stack", () => {
    const result = runAuditEngine(
      [
        tool("Cursor", "Pro", "40", "2"),
        tool("GitHub Copilot", "Business", "38", "2"),
      ],
      "1–10"
    );
    const cursorRec = result.toolResults.find(
      (r) => r.tool.provider === "Cursor"
    )!.recommendation;
    expect(cursorRec.type).toBe("consolidation");
  });

  // 5 ─ ChatGPT + Claude overlap triggers LLM redundancy consolidation
  it("flags LLM redundancy when both ChatGPT and Claude are used", () => {
    const result = runAuditEngine(
      [
        tool("ChatGPT", "Plus", "40", "2"),
        tool("Claude", "Pro", "60", "3"),
      ],
      "1–10"
    );
    const claudeRec = result.toolResults.find(
      (r) => r.tool.provider === "Claude"
    )!.recommendation;
    expect(claudeRec.type).toBe("consolidation");
  });

  // 6 ─ Optimal stack produces zero savings
  it("returns optimal recommendation with zero savings for a well-priced stack", () => {
    // ChatGPT Plus at exactly $20/seat = optimal
    const result = runAuditEngine(
      [tool("ChatGPT", "Plus", "20", "1")],
      "1–10"
    );
    const rec = result.toolResults[0].recommendation;
    expect(rec.type).toBe("optimal");
    expect(rec.savings).toBe(0);
  });

  // 7 ─ Copilot Enterprise triggers downgrade to Business
  it("recommends downgrading GitHub Copilot Enterprise to Business", () => {
    // 10 seats at $39/seat = $390/mo → should downgrade to $19 saves $200
    const result = runAuditEngine(
      [tool("GitHub Copilot", "Enterprise", "390", "10")],
      "11–50"
    );
    const rec = result.toolResults[0].recommendation;
    expect(rec.type).toBe("downgrade");
    expect(rec.savings).toBe(200); // (39-19) * 10
  });

  // 8 ─ High API spend triggers credits recommendation
  it("recommends infrastructure credits for OpenAI API spend over $500", () => {
    const result = runAuditEngine(
      [tool("ChatGPT", "API Direct", "1000", "1")],
      "51–250"
    );
    const rec = result.toolResults[0].recommendation;
    expect(rec.type).toBe("credits");
    expect(rec.savings).toBeGreaterThan(0);
  });

  // 9 ─ Empty tools array returns zero spend
  it("handles empty tools array gracefully", () => {
    const result = runAuditEngine([], "1–10");
    expect(result.totalCurrentSpend).toBe(0);
    expect(result.totalMonthlySavings).toBe(0);
    expect(result.toolResults).toHaveLength(0);
  });

  // 10 ─ Midjourney Pro triggers downgrade to Standard
  it("recommends downgrading Midjourney Pro to Standard for single-user", () => {
    const result = runAuditEngine(
      [tool("Midjourney", "Pro", "60", "1", "Marketing / Creative")],
      "1–10"
    );
    const rec = result.toolResults[0].recommendation;
    expect(rec.type).toBe("downgrade");
    expect(rec.savings).toBe(30); // $60 - $30
  });
});

