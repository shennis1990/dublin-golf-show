begin;
-- Additive booking + admin-auth schema for the existing production project.
-- Run supabase/production-preflight.sql first (read-only) and review the results
-- before executing this file. Do not run until that review is approved.
--
-- This file does not DROP, ALTER, GRANT, or REVOKE on:
--   interest_leads, interest_rate_events, partner_leads, partner_rate_events
--
-- Safe to rerun if a previous attempt failed mid-script: CREATE IF NOT EXISTS,
-- DROP POLICY/TRIGGER IF EXISTS, and seed ON CONFLICT / WHERE NOT EXISTS.
-- It will ABORT if a name already exists with an unexpected shape.
-- It will not roll back a partially committed earlier run automatically;
-- Postgres SQL Editor statements commit as they succeed unless wrapped in an
-- explicit transaction by the operator.

create extension if not exists "pgcrypto";

do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = 'profiles'
  ) and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'role'
  ) then
    raise exception
      'public.profiles already exists without a role column. Inspect it before applying this migration.';
  end if;

  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = 'events'
  ) and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'events'
      and column_name = 'default_token_expiry_days'
  ) then
    raise exception
      'public.events already exists without booking columns. Inspect it before applying this migration.';
  end if;

  if exists (
    select 1
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = 'is_admin'
  ) and not exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = 'profiles'
  ) then
    raise exception
      'public.is_admin() already exists and public.profiles does not. Refusing to replace an unrelated function.';
  end if;
end;
$$;

-- ---------------------------------------------------------------------------
-- Trigger helpers (created before the tables that use them)
-- is_admin() / is_superadmin() are created after public.profiles exists.
-- ---------------------------------------------------------------------------

create or replace function public.prevent_self_role_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null
     and new.id = auth.uid()
     and new.role is distinct from old.role then
    raise exception 'Administrators cannot change their own role';
  end if;
  return new;
end;
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- events
-- ---------------------------------------------------------------------------

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  year integer not null,
  start_date date not null,
  end_date date not null,
  venue text not null,
  default_currency text not null default 'EUR',
  default_vat_rate numeric(5, 2) not null,
  default_deposit_percent numeric(5, 2) not null default 25.00,
  early_booking_cutoff_date date,
  default_deposit_deadline date,
  default_balance_deadline date,
  default_token_expiry_days integer not null default 30,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint events_year_unique unique (year),
  constraint events_dates_ok check (end_date >= start_date),
  constraint events_deposit_percent_ok check (
    default_deposit_percent >= 0 and default_deposit_percent <= 100
  ),
  constraint events_vat_rate_ok check (default_vat_rate >= 0 and default_vat_rate <= 100),
  constraint events_token_expiry_ok check (
    default_token_expiry_days >= 1 and default_token_expiry_days <= 365
  )
);

drop trigger if exists events_set_updated_at on public.events;
create trigger events_set_updated_at
before update on public.events
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- agreement_terms_versions
-- ---------------------------------------------------------------------------

create table if not exists public.agreement_terms_versions (
  id uuid primary key default gen_random_uuid(),
  version integer not null,
  title text not null,
  body text not null,
  is_current boolean not null default false,
  created_at timestamptz not null default now(),
  constraint agreement_terms_versions_version_unique unique (version)
);

create unique index if not exists agreement_terms_versions_one_current
  on public.agreement_terms_versions (is_current)
  where is_current = true;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_role_check check (role in ('admin', 'superadmin'))
);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists profiles_prevent_self_role_change on public.profiles;
create trigger profiles_prevent_self_role_change
before update on public.profiles
for each row execute function public.prevent_self_role_change();

-- ---------------------------------------------------------------------------
-- Helpers (SECURITY DEFINER so profiles RLS does not recurse)
-- Created after public.profiles so SQL-language functions can resolve the table.
-- ---------------------------------------------------------------------------

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('admin', 'superadmin')
  );
$$;

create or replace function public.is_superadmin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'superadmin'
  );
$$;

revoke all on function public.is_admin() from public, anon;
revoke all on function public.is_superadmin() from public, anon;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_superadmin() to authenticated;

-- ---------------------------------------------------------------------------
-- organisations
-- ---------------------------------------------------------------------------

create table if not exists public.organisations (
  id uuid primary key default gen_random_uuid(),
  legal_name text not null,
  trading_name text,
  organisation_type text not null default 'exhibitor',
  primary_contact_name text,
  primary_contact_email text,
  primary_contact_phone text,
  billing_address_line1 text,
  billing_address_line2 text,
  billing_city text,
  billing_county text,
  billing_postcode text,
  billing_country text,
  company_registration_number text,
  vat_number text,
  notes text,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint organisations_type_check check (
    organisation_type in ('exhibitor', 'sponsor', 'both')
  )
);

create index if not exists organisations_legal_name_idx
  on public.organisations (lower(legal_name));

drop trigger if exists organisations_set_updated_at on public.organisations;
create trigger organisations_set_updated_at
before update on public.organisations
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- bookings
-- ---------------------------------------------------------------------------

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  reference text not null,
  organisation_id uuid not null references public.organisations (id) on delete restrict,
  event_id uuid not null references public.events (id) on delete restrict,
  terms_version_id uuid not null references public.agreement_terms_versions (id) on delete restrict,
  category text not null,
  package_name text not null,
  stand_width_m numeric(6, 2),
  stand_depth_m numeric(6, 2),
  stand_reference text,
  price_ex_vat numeric(12, 2) not null,
  vat_rate numeric(5, 2) not null,
  vat_amount numeric(12, 2) not null,
  total_inc_vat numeric(12, 2) not null,
  deposit_percent numeric(5, 2) not null,
  deposit_amount numeric(12, 2) not null,
  deposit_deadline date,
  balance_amount numeric(12, 2) not null,
  balance_deadline date,
  currency text not null default 'EUR',
  status text not null default 'draft',
  invitation_status text not null default 'none',
  notes text,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bookings_reference_unique unique (reference),
  constraint bookings_category_check check (category in ('exhibitor', 'sponsor')),
  constraint bookings_status_check check (
    status in ('draft', 'awaiting_completion', 'signed', 'cancelled')
  ),
  constraint bookings_invitation_status_check check (
    invitation_status in ('none', 'generated', 'sent', 'resent', 'revoked', 'used')
  ),
  constraint bookings_amounts_non_negative check (
    price_ex_vat >= 0
    and vat_amount >= 0
    and total_inc_vat >= 0
    and deposit_amount >= 0
    and balance_amount >= 0
  ),
  constraint bookings_deposit_percent_ok check (
    deposit_percent >= 0 and deposit_percent <= 100
  ),
  constraint bookings_deposit_balance_reconcile check (
    deposit_amount + balance_amount = total_inc_vat
  )
);

create index if not exists bookings_organisation_id_idx on public.bookings (organisation_id);
create index if not exists bookings_event_id_idx on public.bookings (event_id);
create index if not exists bookings_status_idx on public.bookings (status);

drop trigger if exists bookings_set_updated_at on public.bookings;
create trigger bookings_set_updated_at
before update on public.bookings
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- booking_tokens
-- ---------------------------------------------------------------------------

create table if not exists public.booking_tokens (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings (id) on delete cascade,
  token_hash text not null,
  expires_at timestamptz,
  revoked_at timestamptz,
  replaced_by uuid references public.booking_tokens (id),
  last_sent_at timestamptz,
  created_at timestamptz not null default now(),
  constraint booking_tokens_hash_unique unique (token_hash)
);

create unique index if not exists booking_tokens_one_active
  on public.booking_tokens (booking_id)
  where revoked_at is null;

create index if not exists booking_tokens_booking_id_idx
  on public.booking_tokens (booking_id);

-- ---------------------------------------------------------------------------
-- booking_agreements (insert-only for application roles)
-- ---------------------------------------------------------------------------

create table if not exists public.booking_agreements (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings (id) on delete restrict,
  version integer not null,
  terms_version_id uuid not null references public.agreement_terms_versions (id),
  organisation_snapshot jsonb not null,
  booking_snapshot jsonb not null,
  terms_snapshot text not null,
  signer_name text not null,
  signer_role text not null,
  authority_confirmed boolean not null,
  details_confirmed boolean not null,
  terms_accepted boolean not null,
  signed_at timestamptz not null default now(),
  signer_ip text,
  user_agent text,
  created_at timestamptz not null default now(),
  constraint booking_agreements_version_unique unique (booking_id, version),
  constraint booking_agreements_confirmations_check check (
    authority_confirmed = true
    and details_confirmed = true
    and terms_accepted = true
  )
);

create index if not exists booking_agreements_booking_id_idx
  on public.booking_agreements (booking_id);

-- ---------------------------------------------------------------------------
-- booking_payments
-- ---------------------------------------------------------------------------

create table if not exists public.booking_payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings (id) on delete restrict,
  kind text not null,
  amount numeric(12, 2) not null,
  due_date date,
  invoice_reference text,
  invoice_status text not null default 'not_issued',
  payment_status text not null default 'outstanding',
  paid_at date,
  notes text,
  updated_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint booking_payments_kind_unique unique (booking_id, kind),
  constraint booking_payments_kind_check check (kind in ('deposit', 'balance')),
  constraint booking_payments_invoice_status_check check (
    invoice_status in ('not_issued', 'issued', 'cancelled')
  ),
  constraint booking_payments_payment_status_check check (
    payment_status in ('outstanding', 'paid')
  ),
  constraint booking_payments_amount_ok check (amount >= 0)
);

drop trigger if exists booking_payments_set_updated_at on public.booking_payments;
create trigger booking_payments_set_updated_at
before update on public.booking_payments
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- admin_audit_events
-- ---------------------------------------------------------------------------

create table if not exists public.admin_audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles (id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists admin_audit_events_entity_idx
  on public.admin_audit_events (entity_type, entity_id, created_at desc);

create index if not exists admin_audit_events_created_at_idx
  on public.admin_audit_events (created_at desc);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.events enable row level security;
alter table public.agreement_terms_versions enable row level security;
alter table public.profiles enable row level security;
alter table public.organisations enable row level security;
alter table public.bookings enable row level security;
alter table public.booking_tokens enable row level security;
alter table public.booking_agreements enable row level security;
alter table public.booking_payments enable row level security;
alter table public.admin_audit_events enable row level security;

-- Profiles: no recursive policy (helpers are SECURITY DEFINER).
drop policy if exists profiles_select_own_or_admin on public.profiles;
create policy profiles_select_own_or_admin
  on public.profiles
  for select
  to authenticated
  using (id = auth.uid() or public.is_admin());

drop policy if exists profiles_insert_superadmin on public.profiles;
create policy profiles_insert_superadmin
  on public.profiles
  for insert
  to authenticated
  with check (public.is_superadmin());

drop policy if exists profiles_update_superadmin on public.profiles;
create policy profiles_update_superadmin
  on public.profiles
  for update
  to authenticated
  using (public.is_superadmin())
  with check (public.is_superadmin());

-- Admin CRUD on operational tables (anon has no policies = deny).
drop policy if exists events_admin_all on public.events;
create policy events_admin_all
  on public.events for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists agreement_terms_admin_all on public.agreement_terms_versions;
create policy agreement_terms_admin_all
  on public.agreement_terms_versions for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists organisations_admin_all on public.organisations;
create policy organisations_admin_all
  on public.organisations for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists bookings_admin_all on public.bookings;
create policy bookings_admin_all
  on public.bookings for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists booking_tokens_admin_all on public.booking_tokens;
create policy booking_tokens_admin_all
  on public.booking_tokens for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists booking_payments_admin_all on public.booking_payments;
create policy booking_payments_admin_all
  on public.booking_payments for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists admin_audit_admin_select on public.admin_audit_events;
create policy admin_audit_admin_select
  on public.admin_audit_events for select to authenticated
  using (public.is_admin());

drop policy if exists admin_audit_admin_insert on public.admin_audit_events;
create policy admin_audit_admin_insert
  on public.admin_audit_events for insert to authenticated
  with check (public.is_admin());

-- Agreements: insert + select for admins; no update/delete policies or grants.
-- The SQL Editor / table owner can still UPDATE or DELETE. This is not
-- absolute immutability; it blocks PostgREST app roles.
drop policy if exists booking_agreements_admin_select on public.booking_agreements;
create policy booking_agreements_admin_select
  on public.booking_agreements for select to authenticated
  using (public.is_admin());

drop policy if exists booking_agreements_admin_insert on public.booking_agreements;
create policy booking_agreements_admin_insert
  on public.booking_agreements for insert to authenticated
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Grants (new tables only; existing lead tables are not changed)
-- ---------------------------------------------------------------------------

revoke all on table public.events from anon, authenticated, public;
revoke all on table public.agreement_terms_versions from anon, authenticated, public;
revoke all on table public.profiles from anon, authenticated, public;
revoke all on table public.organisations from anon, authenticated, public;
revoke all on table public.bookings from anon, authenticated, public;
revoke all on table public.booking_tokens from anon, authenticated, public;
revoke all on table public.booking_agreements from anon, authenticated, public;
revoke all on table public.booking_payments from anon, authenticated, public;
revoke all on table public.admin_audit_events from anon, authenticated, public;

grant select, insert, update, delete on table public.events to authenticated;
grant select, insert, update, delete on table public.agreement_terms_versions to authenticated;
grant select, insert, update on table public.profiles to authenticated;
grant select, insert, update, delete on table public.organisations to authenticated;
grant select, insert, update, delete on table public.bookings to authenticated;
grant select, insert, update, delete on table public.booking_tokens to authenticated;
grant select, insert on table public.booking_agreements to authenticated;
grant select, insert, update, delete on table public.booking_payments to authenticated;
grant select, insert on table public.admin_audit_events to authenticated;

-- ---------------------------------------------------------------------------
-- Seed: Dublin Golf Show 2027 (VAT 23% confirmed for seed; still reviewable)
-- Terms body is a DRAFT placeholder — solicitor must review before production use.
-- ---------------------------------------------------------------------------

insert into public.events (
  name,
  year,
  start_date,
  end_date,
  venue,
  default_currency,
  default_vat_rate,
  default_deposit_percent,
  early_booking_cutoff_date,
  default_deposit_deadline,
  default_balance_deadline,
  default_token_expiry_days
)
values (
  'Dublin Golf Show 2027',
  2027,
  '2027-06-19',
  '2027-06-20',
  'RDS Simmonscourt, Dublin',
  'EUR',
  23.00,
  25.00,
  '2026-12-01',
  '2026-12-01',
  '2027-03-11',
  30
)
on conflict (year) do nothing;

insert into public.agreement_terms_versions (version, title, body, is_current)
select
  1,
  'Dublin Golf Show 2027 exhibitor and sponsor terms (draft)',
  $terms$DRAFT — not legally approved.

This placeholder will be replaced with solicitor-reviewed exhibitor and sponsor terms before any booking is signed in production.

Proposed (unapproved) outline:
- If the organiser cancels or postpones the event, payments received, including the deposit, are to be refunded in full within 30 days, subject to the final agreed contract wording.
- If the exhibitor or sponsor withdraws, the deposit and any balance already paid are non-refundable, subject to the final booking agreement and applicable law.

Do not treat this text as a binding contract.
$terms$,
  true
where not exists (
  select 1 from public.agreement_terms_versions where version = 1
);

commit;
