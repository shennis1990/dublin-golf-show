-- Run AFTER 20261027_booking_auth.sql on the same project.
-- Raises an exception if a Stage 2 check fails. Does not modify data.

do $$
declare
  missing text;
  policy_count integer;
  current_terms integer;
  event_vat numeric;
  token_days integer;
begin
  -- Lead tables must still exist.
  foreach missing in array array[
    'interest_leads',
    'interest_rate_events',
    'partner_leads',
    'partner_rate_events'
  ]
  loop
    if not exists (
      select 1
      from information_schema.tables
      where table_schema = 'public' and table_name = missing
    ) then
      raise exception 'Lead table missing: %', missing;
    end if;
  end loop;

  -- New booking tables must exist.
  foreach missing in array array[
    'events',
    'agreement_terms_versions',
    'profiles',
    'organisations',
    'bookings',
    'booking_tokens',
    'booking_agreements',
    'booking_payments',
    'admin_audit_events'
  ]
  loop
    if not exists (
      select 1
      from information_schema.tables
      where table_schema = 'public' and table_name = missing
    ) then
      raise exception 'Booking table missing: %', missing;
    end if;
  end loop;

  -- RLS on every table listed above.
  if exists (
    select 1
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relkind = 'r'
      and c.relname in (
        'interest_leads',
        'interest_rate_events',
        'partner_leads',
        'partner_rate_events',
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
      and c.relrowsecurity = false
  ) then
    raise exception 'RLS is not enabled on one or more required tables';
  end if;

  -- Lead tables must have no anon/authenticated policies (writes stay service-role).
  select count(*) into policy_count
  from pg_policies
  where schemaname = 'public'
    and tablename in (
      'interest_leads',
      'interest_rate_events',
      'partner_leads',
      'partner_rate_events'
    );

  if policy_count <> 0 then
    raise exception 'Lead tables unexpectedly have RLS policies (%)', policy_count;
  end if;

  -- booking_agreements must not allow authenticated update/delete.
  if exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'booking_agreements'
      and cmd in ('UPDATE', 'DELETE', 'ALL')
  ) then
    raise exception 'booking_agreements has an update/delete/all policy';
  end if;

  if to_regprocedure('public.is_admin()') is null
     or to_regprocedure('public.is_superadmin()') is null then
    raise exception 'Admin helper functions are missing';
  end if;

  select default_vat_rate, default_token_expiry_days
    into event_vat, token_days
  from public.events
  where year = 2027;

  if event_vat is null then
    raise exception 'Dublin Golf Show 2027 event seed is missing';
  end if;

  if event_vat <> 23.00 then
    raise exception '2027 VAT seed is %, expected 23.00', event_vat;
  end if;

  if token_days <> 30 then
    raise exception '2027 token expiry seed is %, expected 30', token_days;
  end if;

  select count(*) into current_terms
  from public.agreement_terms_versions
  where is_current;

  if current_terms <> 1 then
    raise exception 'Expected exactly one current terms version, found %', current_terms;
  end if;

  raise notice 'Stage 2 booking-auth checks passed';
end;
$$;
