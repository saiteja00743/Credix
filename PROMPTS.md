# LLM Prompts Used in Credex AI

## AI-Generated Personalized Summary

### The Prompt

This prompt is used in `/api/summary` to generate a ~100-word personalized paragraph summarizing the user's audit results. It is sent to the Anthropic API (Claude 3.5 Haiku).

```
You are a senior AI procurement analyst at Credex, a company that helps startups optimize their AI tool spending.

Given the following audit data for a company, write a concise, personalized summary paragraph (approximately 100 words) that:
1. Acknowledges their current total monthly spend
2. Highlights the most impactful finding (biggest savings opportunity or redundancy)
3. Provides a specific, actionable recommendation
4. Mentions the total potential monthly and annual savings
5. If savings are minimal (<$100/mo), congratulate them on efficient spending and suggest monitoring for future optimization opportunities

Be direct, professional, and data-driven. Use specific dollar amounts. Do not use marketing fluff or superlatives. Write as if a finance person will read this and needs to trust the numbers.

Audit Data:
- Total Current Monthly Spend: ${{totalCurrentSpend}}
- Total Potential Monthly Savings: ${{totalMonthlySavings}}
- Total Potential Annual Savings: ${{totalAnnualSavings}}
- Number of Tools Audited: {{toolCount}}
- Tool Details:
{{#each toolResults}}
  - {{tool.provider}}: ${{tool.monthlySpend}}/mo, {{tool.seats}} seats, use case: {{tool.useCase}}
    → Recommendation: {{recommendation.action}} (saves ${{recommendation.savings}}/mo)
    → Reasoning: {{recommendation.reasoning}}
{{/each}}

Write the summary paragraph now.
```

### Why This Prompt Structure

1. **Role assignment** ("senior AI procurement analyst"): Grounds the model in domain expertise so it doesn't hallucinate generic SaaS advice.
2. **Explicit constraints** (100 words, specific dollar amounts, no fluff): Prevents the model from generating verbose or vague output.
3. **Structured data injection**: We pass the full audit results so the model can reference specific tools and numbers rather than guessing.
4. **Finance-person framing**: The assignment requires that "a finance-literate person reads your reasoning and agrees with it." This prompt ensures the output matches that tone.
5. **Low-savings handling**: Explicitly tells the model what to do when savings are minimal, preventing it from manufacturing problems.

### What Didn't Work

1. **First attempt — too open-ended**: "Summarize this audit" produced 300+ word responses with bullet points. Adding the word count constraint and "paragraph" fixed this.
2. **Second attempt — no role**: Without the analyst role, the model defaulted to a generic assistant tone that felt like a chatbot, not a professional report.
3. **Third attempt — missing edge case**: When all tools were "optimal," the model invented savings opportunities. Adding the <$100 handling clause fixed this.

### Fallback Template

If the Anthropic API is unavailable (rate limit, network error, or missing API key), we use a deterministic template that fills in the same data points:

```
Based on our analysis of your {{toolCount}} AI platform(s), your organization
currently spends ${{totalCurrentSpend}}/month on AI infrastructure. Our audit
engine identified ${{totalMonthlySavings}}/month in potential savings
(${{totalAnnualSavings}} annually). {{topRecommendation}}
```

This ensures every user sees a meaningful summary regardless of API availability.
