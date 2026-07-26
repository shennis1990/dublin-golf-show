-- Run this in the Supabase SQL Editor (Project → SQL → New query)

create extension if not exists "pgcrypto";

create table if not exists public.interest_leads (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  consent_marketing boolean not null default false,
  consent_text text not null,
  consent_at timestamptz,
  source text not null default 'register-interest',
  ip_address text,
  last_notified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint interest_leads_email_unique unique (email),
  constraint interest_leads_consent_required check (consent_marketing = true)
);

create index if not exists interest_leads_created_at_idx
  on public.interest_leads (created_at desc);

create or replace function public.set_interest_leads_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists interest_leads_set_updated_at on public.interest_leads;

create trigger interest_leads_set_updated_at
before update on public.interest_leads
for each row
execute function public.set_interest_leads_updated_at();

alter table public.interest_leads enable row level security;

-- Rate-limit / abuse log (one row per submission attempt)
create table if not exists public.interest_rate_events (
  id uuid primary key default gen_random_uuid(),
  ip_address text not null,
  email text,
  created_at timestamptz not null default now()
);

create index if not exists interest_rate_events_ip_created_idx
  on public.interest_rate_events (ip_address, created_at desc);

alter table public.interest_rate_events enable row level security;

-- No public policies: writes go through the server using the service role key.
