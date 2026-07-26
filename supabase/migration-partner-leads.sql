-- Run once in the Supabase SQL Editor for partner / exhibitor enquiries

create table if not exists public.partner_leads (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  company_name text not null,
  phone text not null,
  source text not null default 'partner-with-us',
  ip_address text,
  last_notified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint partner_leads_email_unique unique (email)
);

create index if not exists partner_leads_created_at_idx
  on public.partner_leads (created_at desc);

create or replace function public.set_partner_leads_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists partner_leads_set_updated_at on public.partner_leads;

create trigger partner_leads_set_updated_at
before update on public.partner_leads
for each row
execute function public.set_partner_leads_updated_at();

alter table public.partner_leads enable row level security;

create table if not exists public.partner_rate_events (
  id uuid primary key default gen_random_uuid(),
  ip_address text not null,
  email text,
  created_at timestamptz not null default now()
);

create index if not exists partner_rate_events_ip_created_idx
  on public.partner_rate_events (ip_address, created_at desc);

alter table public.partner_rate_events enable row level security;
