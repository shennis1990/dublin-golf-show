# Production Stage 2 apply (after preflight review)

The booking schema is additive. It does not drop or alter `interest_leads`, `interest_rate_events`, `partner_leads`, or `partner_rate_events`. Enquiry APIs keep using the service-role client. Admin UI uses the cookie session client so RLS applies.

Do not invite or create the first admin until that step is explicitly requested. Recorded later: `shane@dublingolfshow.ie`.

## Before the migration

1. Run the numbered SELECT queries in `supabase/production-preflight.sql` one at a time in the production SQL Editor. Do not apply the migration until those results have been reviewed.
2. Complete the dashboard checks listed in the Stage 2 report (Auth settings cannot be verified from SQL).
3. Confirm the preflight shows the four lead tables present, RLS on, and no unexpected `profiles` / `events` / `is_admin()` objects.

## Apply (only after that review)

1. Run `supabase/migrations/20261027_booking_auth.sql`.
2. Run `supabase/verify-booking-auth.sql`.
3. Confirm enquiry forms still submit on the live site (they do not use the new tables).

## Auth settings (dashboard)

These are not changed by the SQL files:

- Disable public sign-ups (invitation-only).
- Site URL: `https://www.dublingolfshow.ie`
- Redirect URLs: `https://www.dublingolfshow.ie/auth/callback` and `http://localhost:3000/auth/callback` for local admin testing.
- Confirm email / invite templates still point at `/auth/callback`.

Admin login also needs `NEXT_PUBLIC_SUPABASE_ANON_KEY` in local and Vercel env. Do not put the service-role key in any `NEXT_PUBLIC_` variable.

## First superadmin (later, not this step)

After an Auth invite for `shane@dublingolfshow.ie` is accepted:

```sql
insert into public.profiles (id, role)
select id, 'superadmin'
from auth.users
where lower(email) = 'shane@dublingolfshow.ie'
on conflict (id) do nothing;
```

Until a superadmin row exists, the app cannot create one: `profiles` insert is limited to existing superadmins.
