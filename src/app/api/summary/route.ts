import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

interface ToolInput {
  provider: string;
  monthlySpend: string;
  seats: string;
  useCase: string;
}

interface RecommendationInput {
  action: string;
  savings: number;
  reasoning: string;
  type: string;
}

interface ToolResultInput {
  tool: ToolInput;
  recommendation: RecommendationInput;
}

interface SummaryRequest {
  totalCurrentSpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  toolResults: ToolResultInput[];
}

/**
 * Generates a deterministic fallback summary when the Anthropic API is unavailable.
 * This ensures the tool always delivers value regardless of API status.
 */
function generateFallbackSummary(data: SummaryRequest): string {
  const { totalCurrentSpend, totalMonthlySavings, totalAnnualSavings, toolResults } = data;
  const toolCount = toolResults.length;

  // Find the biggest savings opportunity
  const sorted = [...toolResults].sort((a, b) => b.recommendation.savings - a.recommendation.savings);
  const topSaver = sorted[0];

  if (totalMonthlySavings < 100) {
    return `Based on our analysis of your ${toolCount} AI platform${toolCount > 1 ? "s" : ""}, your organization currently spends $${totalCurrentSpend.toLocaleString()}/month on AI infrastructure. Your spending is well-optimized — we identified only $${totalMonthlySavings.toFixed(0)}/month in potential minor adjustments. This puts you in the top quartile of efficient AI spenders. We recommend monitoring your stack quarterly as pricing and feature parity across providers evolves rapidly.`;
  }

  const topRecommendation = topSaver
    ? `The most impactful change: ${topSaver.recommendation.action} for ${topSaver.tool.provider} (saving $${topSaver.recommendation.savings.toFixed(0)}/month). ${topSaver.recommendation.reasoning}`
    : "";

  return `Based on our analysis of your ${toolCount} AI platform${toolCount > 1 ? "s" : ""}, your organization currently spends $${totalCurrentSpend.toLocaleString()}/month on AI infrastructure. Our audit engine identified $${totalMonthlySavings.toFixed(0)}/month in potential savings ($${totalAnnualSavings.toLocaleString()} annually). ${topRecommendation}`;
}

export async function POST(request: NextRequest) {
  try {
    const body: SummaryRequest = await request.json();

    // Validate input
    if (!body.toolResults || body.toolResults.length === 0) {
      return NextResponse.json(
        { error: "No tool results provided" },
        { status: 400 }
      );
    }

    // Check if API key is available
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      // Graceful fallback: return a template-based summary
      return NextResponse.json({
        summary: generateFallbackSummary(body),
        source: "fallback",
      });
    }

    // Build the prompt with real audit data
    const toolDetails = body.toolResults
      .map(
        (tr) =>
          `  - ${tr.tool.provider}: $${tr.tool.monthlySpend}/mo, ${tr.tool.seats} seats, use case: ${tr.tool.useCase}\n    → Recommendation: ${tr.recommendation.action} (saves $${tr.recommendation.savings.toFixed(2)}/mo)\n    → Reasoning: ${tr.recommendation.reasoning}`
      )
      .join("\n");

    const prompt = `You are a senior AI procurement analyst at Credex, a company that helps startups optimize their AI tool spending.

Given the following audit data for a company, write a concise, personalized summary paragraph (approximately 100 words) that:
1. Acknowledges their current total monthly spend
2. Highlights the most impactful finding (biggest savings opportunity or redundancy)
3. Provides a specific, actionable recommendation
4. Mentions the total potential monthly and annual savings
5. If savings are minimal (<$100/mo), congratulate them on efficient spending and suggest monitoring for future optimization opportunities

Be direct, professional, and data-driven. Use specific dollar amounts. Do not use marketing fluff or superlatives. Write as if a finance person will read this and needs to trust the numbers.

Audit Data:
- Total Current Monthly Spend: $${body.totalCurrentSpend}
- Total Potential Monthly Savings: $${body.totalMonthlySavings}
- Total Potential Annual Savings: $${body.totalAnnualSavings}
- Number of Tools Audited: ${body.toolResults.length}
- Tool Details:
${toolDetails}

Write the summary paragraph now.`;

    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: "claude-3-5-haiku-latest",
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }],
    });

    // Extract text from the response
    const textBlock = message.content.find((block) => block.type === "text");
    const summary = textBlock ? textBlock.text : generateFallbackSummary(body);

    return NextResponse.json({
      summary,
      source: "anthropic",
    });
  } catch (error: unknown) {
    console.error("Summary API error:", error);

    // On any failure (rate limit, network, etc.), return the fallback
    // Try to parse the body again for fallback generation
    try {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      
      // If we can still access the request body, generate a fallback
      // Otherwise return a generic error
      return NextResponse.json({
        summary: "We were unable to generate a personalized AI summary at this time. Your audit results and savings calculations above are fully accurate and based on current market pricing data.",
        source: "fallback",
        error: errorMessage,
      });
    } catch {
      return NextResponse.json(
        { error: "Failed to generate summary" },
        { status: 500 }
      );
    }
  }
}
