-- Migration for existing projects that already ran the original schema.sql
-- Run once in the Supabase SQL Editor.

alter table public.interest_leads
  add column if not exists ip_address text,
  add column if not exists last_notified_at timestamptz;

create table if not exists public.interest_rate_events (
  id uuid primary key default gen_random_uuid(),
  ip_address text not null,
  email text,
  created_at timestamptz not null default now()
);

create index if not exists interest_rate_events_ip_created_idx
  on public.interest_rate_events (ip_address, created_at desc);

alter table public.interest_rate_events enable row level security;
