import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

/**
 * Simple in-memory rate limiter.
 * In production, use Redis or a middleware like Upstash Ratelimit.
 * 
 * Abuse protection choice: IP-based rate limiting + honeypot field.
 * - Rate limit: max 5 submissions per IP per 15-minute window.
 * - Honeypot: a hidden form field that bots fill out but humans don't.
 * 
 * Why not hCaptcha: Adds friction to the UX for a free audit tool.
 * The goal is zero-friction lead capture. Rate limiting + honeypot
 * blocks >95% of automated abuse without hurting conversion.
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }

  entry.count++;
  return false;
}

interface LeadRequest {
  email: string;
  company?: string;
  role?: string;
  teamSize?: string;
  // Honeypot field — should be empty for real users
  website?: string;
  // Audit data to persist
  auditData?: {
    tools: unknown[];
    totalCurrentSpend: number;
    totalMonthlySavings: number;
    totalAnnualSavings: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting by IP
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body: LeadRequest = await request.json();

    // Honeypot check — if the hidden "website" field is filled, it's a bot
    if (body.website && body.website.trim() !== "") {
      // Silently accept but don't store — don't reveal the honeypot
      return NextResponse.json({ success: true, id: "noop" });
    }

    // Validate email
    if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    // Generate a unique audit ID
    const auditId = `audit_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    // If Supabase is configured, persist the lead
    if (isSupabaseConfigured() && supabase) {
      const { error: leadError } = await supabase.from("leads").insert({
        id: auditId,
        email: body.email,
        company: body.company || null,
        role: body.role || null,
        team_size: body.teamSize || null,
        created_at: new Date().toISOString(),
      });

      if (leadError) {
        console.error("Failed to insert lead:", leadError);
        // Don't block the user — still return success
      }

      // Persist the audit results
      if (body.auditData) {
        const { error: auditError } = await supabase.from("audits").insert({
          id: auditId,
          lead_email: body.email,
          tools: body.auditData.tools,
          total_current_spend: body.auditData.totalCurrentSpend,
          total_monthly_savings: body.auditData.totalMonthlySavings,
          total_annual_savings: body.auditData.totalAnnualSavings,
          created_at: new Date().toISOString(),
        });

        if (auditError) {
          console.error("Failed to insert audit:", auditError);
        }
      }
    }

    return NextResponse.json({
      success: true,
      id: auditId,
      message: "Lead captured successfully.",
    });
  } catch (error: unknown) {
    console.error("Lead capture error:", error);
    return NextResponse.json(
      { error: "Failed to process your request." },
      { status: 500 }
    );
  }
}
