# User Interview Insights

To validate the problem space for Credex AI, I conducted discovery sessions with departmental leadership and faculty to understand how AI tool spending is managed in an academic and research environment.

## Key Learnings & Quotes

### Interview 1: Dr. Sravanakumari, Head of Department (HOD)
**The Problem:** "Each research lab and individual faculty member is currently requesting separate reimbursements for AI tools like ChatGPT Plus and Midjourney. As HOD, I see the total outflow, but I have no centralized way to know if we are over-provisioning seats or if we could benefit from an institutional 'Team' plan instead of 20 individual 'Pro' plans."
**Insight:** Institutional environments suffer from 'reimbursement fragmentation' where the total spend is high but visibility is low.
**Validation:** A centralized 'Departmental Audit' feature would save the HOD significant time in budget reconciliation.

### Interview 2: Mr. Ramesh, Lecturer & Lab Coordinator
**The Problem:** "In the coding labs, many students and staff are using tools like GitHub Copilot or Cursor. The main challenge is that we don't know who is actually using the advanced features and who just needs basic access. We are likely paying for 'Enterprise' features that our current research scope doesn't even touch."
**Insight:** Users often default to the most expensive tier because it's the most marketed, even if 80% of the features are redundant for their specific use case.
**Validation:** The 'Plan Mismatch' logic in Credex is highly relevant for lab environments trying to optimize grant funding.

### Interview 3: Project Coordinator (Research & Grants)
**The Problem:** "When applying for research grants, we have to project our AI infrastructure costs. Currently, it's just guesswork. We need a tool that can look at our current stack and give us a defensible forecast of what our spend *should* be if we optimize for the coming year."
**Insight:** Forecasting and 'Defensible Budgeting' are key value drivers for academic leadership.
**Validation:** The 'Annual Savings Projection' in the Credex dashboard is the exact metric needed for grant applications.

## Design Implications for Credex MVP
1. **Simplified Documentation:** Academic environments value clear, printable reports (PDFs) that can be attached to budget meetings or grant reports.
2. **Deterministic Trust:** Since these audits are reviewed by academic boards, the logic must be 100% transparent and traceable to official vendor pricing URLs.
3. **Multi-User Visibility:** The need for a "Shareable Report" is high, as faculty must justify costs to the HOD for approval.
