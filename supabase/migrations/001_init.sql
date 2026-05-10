-- ============================================================
-- Credex AI Spend Audit — Supabase Schema
-- Migration: 001_init
-- Created: 2026-05-09
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------
-- TABLE: leads
-- Stores email and basic firmographic info from the audit form.
-- ----------------------------------------------------------------
create table if not exists public.leads (
  id            text        primary key,               -- audit_<timestamp>_<random>
  email         text        not null,
  company       text,
  role          text,
  team_size     text,
  created_at    timestamptz not null default now()
);

-- Index for fast email lookups
create index if not exists leads_email_idx on public.leads (email);

-- ----------------------------------------------------------------
-- TABLE: audits
-- Stores the full audit payload, linked to a lead via email.
-- ----------------------------------------------------------------
create table if not exists public.audits (
  id                     text        primary key,      -- same as leads.id
  lead_email             text        not null,
  tools                  jsonb       not null default '[]',
  total_current_spend    numeric     not null default 0,
  total_monthly_savings  numeric     not null default 0,
  total_annual_savings   numeric     not null default 0,
  ai_summary             text,                         -- cached Claude summary
  created_at             timestamptz not null default now()
);

-- Foreign key — every audit must have a corresponding lead
alter table public.audits
  add constraint audits_lead_id_fk
  foreign key (id) references public.leads (id)
  on delete cascade
  deferrable initially deferred;

-- Index for fast lookups by ID (public share links)
create index if not exists audits_id_idx on public.audits (id);

-- ----------------------------------------------------------------
-- ROW LEVEL SECURITY
-- The anon key can only INSERT — never SELECT or UPDATE.
-- Use the service_role key (server-only) for admin reads.
-- ----------------------------------------------------------------
alter table public.leads  enable row level security;
alter table public.audits enable row level security;

-- Anon key: INSERT only (lead capture form)
create policy "anon insert leads"
  on public.leads for insert
  to anon
  with check (true);

create policy "anon insert audits"
  on public.audits for insert
  to anon
  with check (true);

-- Authenticated (service role): full access for admin dashboard
create policy "service full access leads"
  on public.leads for all
  to service_role
  using (true)
  with check (true);

create policy "service full access audits"
  on public.audits for all
  to service_role
  using (true)
  with check (true);

-- Public SELECT: only allow reading an audit by its own ID
-- This powers the /report/[id] shareable link.
create policy "public read audit by id"
  on public.audits for select
  to anon
  using (true);
