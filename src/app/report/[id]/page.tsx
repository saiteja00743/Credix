import { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import ReportClient from "./ReportClient";

interface Props {
  params: Promise<{ id: string }>;
}

/**
 * Fetches the audit from Supabase for SSR / OG tag generation.
 * Falls back gracefully if Supabase is not configured.
 */
async function getAudit(id: string) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const client = createClient(url, key);
  const { data, error } = await client
    .from("audits")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Report fetch error:", error.message);
    return null;
  }
  return data;
}

/**
 * Dynamic OG metadata — makes the shareable link look great on LinkedIn, X, Slack.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const audit = await getAudit(id);

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://credex-ai.vercel.app";

  if (!audit) {
    return {
      title: "AI Spend Audit Report | Credex AI",
      description:
        "View your personalized AI spend audit — identify redundancies and unlock savings.",
      openGraph: {
        title: "AI Spend Audit Report | Credex AI",
        description:
          "View your personalized AI spend audit — identify redundancies and unlock savings.",
        url: `${baseUrl}/report/${id}`,
        siteName: "Credex AI",
        type: "website",
      },
    };
  }

  const monthly = Math.round(audit.total_monthly_savings ?? 0);
  const annual = Math.round(audit.total_annual_savings ?? 0);

  return {
    title: `$${annual.toLocaleString()}/yr savings identified | Credex AI Audit`,
    description: `This AI spend audit identified $${monthly.toLocaleString()}/month ($${annual.toLocaleString()}/year) in potential savings across ${(audit.tools as unknown[])?.length ?? 0} AI tools.`,
    openGraph: {
      title: `$${annual.toLocaleString()}/yr in AI savings identified`,
      description: `Credex AI found $${monthly.toLocaleString()}/month in optimization opportunities across your AI stack.`,
      url: `${baseUrl}/report/${id}`,
      siteName: "Credex AI",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `$${annual.toLocaleString()}/yr in AI savings identified`,
      description: `Credex AI found $${monthly.toLocaleString()}/month in optimization opportunities across your AI stack.`,
    },
  };
}

export default async function ReportPage({ params }: Props) {
  const { id } = await params;
  const audit = await getAudit(id);

  return <ReportClient audit={audit} auditId={id} />;
}
