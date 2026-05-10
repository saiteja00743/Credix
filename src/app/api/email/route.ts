import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/email
 *
 * Sends a transactional confirmation email via Resend after a lead submits
 * the audit form. Called internally by /api/leads after a successful insert.
 *
 * Email design: dark-themed HTML email matching the Credex brand.
 * Fallback: if RESEND_API_KEY is not set, logs and skips silently.
 */

interface EmailPayload {
  to: string;
  name?: string;
  company?: string;
  auditId: string;
  monthlySavings: number;
  annualSavings: number;
  toolCount: number;
}

function buildHtml({
  name,
  company,
  auditId,
  monthlySavings,
  annualSavings,
  toolCount,
}: EmailPayload): string {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://credex-ai.vercel.app";
  const reportUrl = `${baseUrl}/report/${auditId}`;
  const fmt = (n: number) =>
    n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Credex AI Spend Audit is ready</title>
</head>
<body style="margin:0;padding:0;background:#0e1511;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0e1511;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Logo -->
        <tr>
          <td style="padding-bottom:32px;">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:rgba(78,222,163,0.1);border:1px solid rgba(78,222,163,0.2);border-radius:8px;width:36px;height:36px;text-align:center;vertical-align:middle;">
                  <span style="color:#4edea3;font-size:18px;font-weight:900;">⚡</span>
                </td>
                <td style="padding-left:10px;color:#f0f4f2;font-size:20px;font-weight:700;letter-spacing:-0.5px;">
                  Credex<span style="color:#4edea3;">AI</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Hero card -->
        <tr>
          <td style="background:#161d19;border:1px solid rgba(60,74,66,0.3);border-radius:20px;padding:40px 36px;">

            <p style="margin:0 0 8px;color:#4edea3;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">
              ✦ Audit Complete
            </p>
            <h1 style="margin:0 0 16px;color:#f0f4f2;font-size:28px;font-weight:700;line-height:1.2;letter-spacing:-0.5px;">
              ${monthlySavings > 0 ? `We found $${fmt(monthlySavings)}/mo you can save` : "Your AI stack is well optimized"}
            </h1>
            <p style="margin:0 0 32px;color:#8fa899;font-size:15px;line-height:1.6;">
              Hi${name ? ` ${name}` : ""}${company ? ` from ${company}` : ""},<br/><br/>
              Your <strong style="color:#f0f4f2;">Credex AI Spend Audit</strong> is ready. 
              We analyzed <strong style="color:#f0f4f2;">${toolCount} AI tool${toolCount !== 1 ? "s" : ""}</strong> in your stack 
              and identified <strong style="color:#4edea3;">$${fmt(annualSavings)} in annual savings</strong> that you can 
              unlock today through plan optimization and consolidation.
            </p>

            <!-- Savings metrics -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
              <tr>
                <td width="48%" style="background:rgba(78,222,163,0.06);border:1px solid rgba(78,222,163,0.15);border-radius:12px;padding:20px;text-align:center;">
                  <p style="margin:0 0 4px;color:#8fa899;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">Monthly Savings</p>
                  <p style="margin:0;color:#4edea3;font-size:28px;font-weight:700;font-family:monospace;">$${fmt(monthlySavings)}</p>
                </td>
                <td width="4%"></td>
                <td width="48%" style="background:rgba(152,206,178,0.06);border:1px solid rgba(152,206,178,0.15);border-radius:12px;padding:20px;text-align:center;">
                  <p style="margin:0 0 4px;color:#8fa899;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">Annual Savings</p>
                  <p style="margin:0;color:#98ceb2;font-size:28px;font-weight:700;font-family:monospace;">$${fmt(annualSavings)}</p>
                </td>
              </tr>
            </table>

            <!-- CTA -->
            <a href="${reportUrl}" style="display:block;background:#4edea3;color:#0e1511;text-decoration:none;text-align:center;padding:16px 24px;border-radius:12px;font-size:15px;font-weight:700;letter-spacing:-0.2px;margin-bottom:20px;">
              View Full Audit Report →
            </a>

            <!-- Secondary CTA -->
            <p style="margin:0;text-align:center;color:#8fa899;font-size:12px;">
              Or copy this link: 
              <a href="${reportUrl}" style="color:#4edea3;word-break:break-all;">${reportUrl}</a>
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding-top:28px;text-align:center;">
            <p style="margin:0 0 8px;color:#4d5d54;font-size:12px;line-height:1.5;">
              You're receiving this because you submitted an audit at <a href="${baseUrl}" style="color:#4edea3;text-decoration:none;">credex-ai.vercel.app</a>.
            </p>
            <p style="margin:0;color:#4d5d54;font-size:11px;">
              Credex AI · AI Spend Intelligence · No credit card required
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function POST(request: NextRequest) {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    // Not configured — skip silently
    return NextResponse.json({ skipped: true, reason: "RESEND_API_KEY not set" });
  }

  try {
    const payload: EmailPayload = await request.json();

    if (!payload.to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.to)) {
      return NextResponse.json({ error: "Invalid recipient email" }, { status: 400 });
    }

    const html = buildHtml(payload);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Credex AI <onboarding@resend.dev>",
        to: [payload.to],
        subject: `Your AI Spend Audit: $${Math.round(payload.annualSavings).toLocaleString()} annual savings identified`,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Resend API error:", err);
      return NextResponse.json({ error: "Email delivery failed" }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, id: data.id });
  } catch (error: unknown) {
    console.error("Email route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
