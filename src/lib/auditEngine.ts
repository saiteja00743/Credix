export interface ToolEntry {
  id: string;
  provider: string;
  monthlySpend: string;
  seats: string;
  useCase: string;
}

export interface Recommendation {
  action: string;
  savings: number;
  reasoning: string;
  type: "downgrade" | "consolidation" | "credits" | "optimal" | "switch";
}

export interface AuditResult {
  totalCurrentSpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  toolResults: {
    tool: ToolEntry;
    recommendation: Recommendation;
  }[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function runAuditEngine(tools: ToolEntry[], _teamSize: string): AuditResult {
  let totalCurrentSpend = 0;
  let totalMonthlySavings = 0;
  
  const toolResults = tools.map((tool) => {
    const spend = parseFloat(tool.monthlySpend || "0");
    const seats = parseInt(tool.seats || "1", 10);
    totalCurrentSpend += spend;
    
    let recommendation: Recommendation = {
      action: "Keep Current Plan",
      savings: 0,
      reasoning: "Your current spending is perfectly optimized for this tool.",
      type: "optimal"
    };

    const costPerSeat = seats > 0 ? spend / seats : spend;

    if (tool.provider === "ChatGPT / OpenAI") {
      if (seats === 2 && spend >= 50) {
        recommendation = {
          action: "Downgrade to ChatGPT Plus (Shared/Individual)",
          savings: spend - 40,
          reasoning: "ChatGPT Team requires a minimum of 2 seats ($50/mo), but small teams often operate efficiently on 2 individual Plus accounts ($40/mo) without enterprise management features.",
          type: "downgrade"
        };
      } else if (costPerSeat > 25 && seats >= 2) {
        recommendation = {
          action: "Optimize Enterprise/API Spend",
          savings: spend - (25 * seats),
          reasoning: "You are paying a premium per seat. Moving to standard ChatGPT Team ($25/user) or auditing API overages could reduce waste.",
          type: "downgrade"
        };
      } else if (tool.useCase === "Software Engineering" && tools.some(t => t.provider === "Cursor" || t.provider === "GitHub Copilot")) {
        recommendation = {
          action: "Consolidate Dev Tools",
          savings: spend,
          reasoning: "You are paying for ChatGPT while also paying for a dedicated AI coding assistant (Cursor/Copilot) which already includes premium LLM access.",
          type: "consolidation"
        };
      } else if (spend > 500) {
        recommendation = {
          action: "Apply Startup Cloud Credits",
          savings: spend * 0.2, // Estimate 20% savings via credits/commit
          reasoning: "High API usage detected. We can help you secure OpenAI infrastructure credits through Azure or AWS startups programs.",
          type: "credits"
        };
      }
    } 
    else if (tool.provider === "Claude / Anthropic") {
      if (costPerSeat > 20 && seats < 5) {
        recommendation = {
          action: "Downgrade to Claude Pro",
          savings: spend - (20 * seats),
          reasoning: "Claude Team ($30/user) requires a minimum of 5 seats. Using individual Claude Pro accounts ($20/user) is more cost-effective for small teams.",
          type: "downgrade"
        };
      } else if (spend > 500) {
        recommendation = {
          action: "Apply Infrastructure Credits",
          savings: spend * 0.2,
          reasoning: "Anthropic API usage over $500/mo can often be offset by AWS Bedrock or GCP Vertex AI startup credits.",
          type: "credits"
        };
      }
    }
    else if (tool.provider === "Cursor") {
      if (costPerSeat >= 40) {
        recommendation = {
          action: "Downgrade to Cursor Pro",
          savings: spend - (20 * seats),
          reasoning: "Cursor Business ($40/user) adds centralized billing and privacy. Unless mandated by compliance, Cursor Pro ($20/user) offers the exact same AI capabilities.",
          type: "downgrade"
        };
      }
    }
    else if (tool.provider === "GitHub Copilot") {
      if (costPerSeat >= 39) {
        recommendation = {
          action: "Downgrade to Copilot Business",
          savings: spend - (19 * seats),
          reasoning: "Copilot Enterprise ($39/user) is rarely utilized fully by startups. Copilot Business ($19/user) is sufficient for 95% of engineering teams.",
          type: "downgrade"
        };
      } else if (costPerSeat >= 19 && seats <= 3) {
         recommendation = {
          action: "Downgrade to Copilot Individual",
          savings: spend - (10 * seats),
          reasoning: "For very small teams, Copilot Individual ($10/user) is half the price of Business and provides identical autocomplete features.",
          type: "downgrade"
        };
      }
    }
    else if (tool.provider === "Midjourney") {
      if (spend >= 60 && seats === 1) {
        recommendation = {
          action: "Downgrade to Standard Plan",
          savings: spend - 30,
          reasoning: "Midjourney Pro ($60/mo) is only necessary if you require stealth mode. The Standard plan ($30/mo) provides ample fast GPU hours for most marketing needs.",
          type: "downgrade"
        };
      }
    }
    else if (tool.provider === "Gemini / Google") {
      if (costPerSeat > 20 && seats >= 2) {
        recommendation = {
          action: "Optimize Gemini Seat Count",
          savings: spend - (20 * seats),
          reasoning: "At $20/user/month for Google One AI Premium (Gemini Ultra), verify that all seats are actively using advanced features. Users who only need basic access can use the free Gemini tier.",
          type: "downgrade"
        };
      } else if (tool.useCase === "Software Engineering" && tools.some(t => t.provider === "Cursor" || t.provider === "GitHub Copilot")) {
        recommendation = {
          action: "Consolidate with Existing Dev Tools",
          savings: spend,
          reasoning: "Gemini for coding overlaps significantly with your existing Cursor/Copilot subscription. Most engineering teams don't need both a dedicated code assistant and a general-purpose LLM for coding.",
          type: "consolidation"
        };
      }
    }
    else if (tool.provider === "Perplexity AI") {
      if (costPerSeat > 20) {
        recommendation = {
          action: "Audit Perplexity Pro Usage",
          savings: spend - (20 * seats),
          reasoning: "Perplexity Pro is $20/user/month. If you're paying more, you may have unused seats. Consider whether free-tier Perplexity covers most research needs.",
          type: "downgrade"
        };
      } else if (tools.some(t => t.provider === "ChatGPT / OpenAI" || t.provider === "Claude / Anthropic") && recommendation.type === "optimal") {
        recommendation = {
          action: "Evaluate Research Tool Overlap",
          savings: spend * 0.5,
          reasoning: "Perplexity Pro's core value is AI-powered research. With ChatGPT/Claude already in your stack, consider whether the free Perplexity tier plus your existing LLMs can cover research use cases.",
          type: "consolidation"
        };
      }
    }
    else if (tool.provider === "Windsurf / Codeium") {
      if (costPerSeat > 15) {
        recommendation = {
          action: "Downgrade to Windsurf Pro",
          savings: spend - (15 * seats),
          reasoning: "Windsurf Pro ($15/user/month) provides full AI-assisted coding features. Enterprise tiers add admin controls that most small teams don't need.",
          type: "downgrade"
        };
      } else if (tools.some(t => t.provider === "Cursor" || t.provider === "GitHub Copilot") && recommendation.type === "optimal") {
        recommendation = {
          action: "Eliminate Code Assistant Redundancy",
          savings: spend,
          reasoning: "Running Windsurf alongside Cursor or GitHub Copilot is redundant. Standardize on one AI code editor to eliminate duplicate spending.",
          type: "consolidation"
        };
      }
    }
    else if (tool.provider === "Other / Custom API" && spend > 1000) {
      recommendation = {
        action: "Negotiate Custom Enterprise Tier",
        savings: spend * 0.15,
        reasoning: "Custom API spend exceeding $1k/mo qualifies for enterprise rate negotiation or bulk token commitments.",
        type: "credits"
      };
    }

    // Cross-platform Overlap check: Claude + ChatGPT
    if (
      tool.provider === "Claude / Anthropic" &&
      tools.some(t => t.provider === "ChatGPT / OpenAI") && 
      recommendation.type === "optimal"
    ) {
        recommendation = {
          action: "Eliminate LLM Redundancy",
          savings: spend,
          reasoning: "Your team is paying for both ChatGPT and Claude. Standardizing on one platform is the #1 way startups reduce AI tool bloat.",
          type: "consolidation"
        };
    }

    // Cross-platform Overlap check: Cursor + Copilot
    if (
      tool.provider === "Cursor" &&
      tools.some(t => t.provider === "GitHub Copilot") &&
      recommendation.type === "optimal"
    ) {
        recommendation = {
          action: "Consolidate Code Assistants",
          savings: spend,
          reasoning: "Running both Cursor and GitHub Copilot is redundant — both provide AI-powered autocomplete and chat. Pick the one your team prefers and eliminate the other.",
          type: "consolidation"
        };
    }

    totalMonthlySavings += recommendation.savings;

    return {
      tool,
      recommendation
    };
  });

  return {
    totalCurrentSpend,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
    toolResults,
  };
}
