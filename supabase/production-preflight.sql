-- Production preflight. Read-only. Run one numbered SELECT at a time.
-- This file contains SELECT statements only.
-- It does not contain CREATE, ALTER, DROP, INSERT, UPDATE, DELETE, GRANT, or REVOKE.
--
-- Open the production project → SQL Editor → New query.
-- Copy one query, Run, then send back the result before moving on if asked.
-- If a query fails, stop and share the error instead of skipping ahead.

-- 1. Existing lead tables
-- Checks whether the four enquiry tables are present in public.
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in (
    'interest_leads',
    'interest_rate_events',
    'partner_leads',
    'partner_rate_events'
  )
order by table_name;

-- 2. RLS status
-- Checks whether row level security is enabled on each of those four tables.
select c.relname as table_name,
       c.relrowsecurity as rls_enabled
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relkind = 'r'
  and c.relname in (
    'interest_leads',
    'interest_rate_events',
    'partner_leads',
    'partner_rate_events'
  )
order by c.relname;

-- 3. Existing policies
-- Lists any RLS policies on the four lead tables, including roles and commands.
select tablename,
       policyname,
       roles,
       cmd
from pg_policies
where schemaname = 'public'
  and tablename in (
    'interest_leads',
    'interest_rate_events',
    'partner_leads',
    'partner_rate_events'
  )
order by tablename, policyname;

-- 4. Table grants
-- Lists privileges for anon, authenticated, service_role, and public on the four lead tables.
select table_name,
       grantee,
       privilege_type
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name in (
    'interest_leads',
    'interest_rate_events',
    'partner_leads',
    'partner_rate_events'
  )
  and grantee in ('anon', 'authenticated', 'service_role', 'public')
order by table_name, grantee, privilege_type;

-- 5a. Booking table name conflicts
-- Lists any proposed booking tables that already exist in public.
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in (
    'events',
    'agreement_terms_versions',
    'profiles',
    'organisations',
    'bookings',
    'booking_tokens',
    'booking_agreements',
    'booking_payments',
    'admin_audit_events'
  )
order by table_name;

-- 5b. Booking function name conflicts
-- Lists any proposed helper functions that already exist in public.
select routine_name
from information_schema.routines
where routine_schema = 'public'
  and routine_name in (
    'is_admin',
    'is_superadmin',
    'prevent_self_role_change',
    'set_updated_at'
  )
order by routine_name;

-- 6. Required enquiry columns
-- Lists the actual columns on the four lead tables for comparison with the enquiry APIs.
select table_name,
       column_name,
       data_type,
       is_nullable
from information_schema.columns
where table_schema = 'public'
  and table_name in (
    'interest_leads',
    'interest_rate_events',
    'partner_leads',
    'partner_rate_events'
  )
order by table_name, ordinal_position;

-- 7. Existing Auth users
-- Lists Auth user emails and confirmation/creation times. No passwords or tokens.
select email,
       email_confirmed_at,
       created_at
from auth.users
order by created_at;

-- 8. Auth providers
-- Lists identity providers already in use.
select distinct provider
from auth.identities
order by provider;

-- 9. pgcrypto
-- Checks whether the pgcrypto extension is installed and which version.
select extname,
       extversion
from pg_extension
where extname = 'pgcrypto';
