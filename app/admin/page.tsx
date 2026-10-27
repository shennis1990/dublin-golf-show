import Link from "next/link";
import { AdminChrome } from "@/components/admin/AdminChrome";
import { Button } from "@/components/ui/Button";
import { requireAdmin } from "@/lib/auth/require-admin";
import { formatEur } from "@/lib/booking/calc";
import { createClient } from "@/lib/supabase/server";
import { approveCurrentTerms } from "@/app/admin/bookings/actions";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await requireAdmin();
  const { error } = await searchParams;
  const supabase = await createClient();

  const [
    { count: orgCount },
    { data: bookings },
    { data: terms },
    { data: event },
  ] = await Promise.all([
    supabase
      .from("organisations")
      .select("id", { count: "exact", head: true }),
    supabase
      .from("bookings")
      .select(
        "id, reference, status, invitation_status, total_inc_vat, created_at, organisations(legal_name)",
      )
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("agreement_terms_versions")
      .select("id, version_number, status, title, is_current")
      .eq("is_current", true)
      .maybeSingle(),
    supabase
      .from("events")
      .select("name, default_vat_rate, default_deposit_percent, default_token_expiry_days")
      .eq("slug", "dublin-golf-show-2027")
      .maybeSingle(),
  ]);

  return (
    <AdminChrome email={session.user.email || ""} role={session.role}>
      <h1 className="font-display text-3xl font-semibold text-white">Booking dashboard</h1>
      <p className="mt-2 text-white/55">
        Signed in as {session.user.email} ({session.role}). Access is limited to profiles with admin
        or superadmin roles.
      </p>

      {error === "terms" ? (
        <p className="mt-4 text-red-200" role="alert">
          Could not approve agreement terms.
        </p>
      ) : null}

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-white/10 p-5">
          <p className="text-xs uppercase tracking-[0.12em] text-white/40">Organisations</p>
          <p className="mt-2 font-display text-3xl text-white">{orgCount ?? 0}</p>
        </div>
        <div className="rounded-3xl border border-white/10 p-5">
          <p className="text-xs uppercase tracking-[0.12em] text-white/40">VAT / deposit</p>
          <p className="mt-2 text-white">
            {event ? `${event.default_vat_rate}% VAT · ${event.default_deposit_percent}% deposit` : "Event missing"}
          </p>
        </div>
        <div className="rounded-3xl border border-white/10 p-5">
          <p className="text-xs uppercase tracking-[0.12em] text-white/40">Terms</p>
          <p className="mt-2 text-white">
            {terms
              ? `v${terms.version_number} · ${terms.status}`
              : "No current terms"}
          </p>
          {terms && terms.status !== "approved" ? (
            <form action={approveCurrentTerms} className="mt-4">
              <Button type="submit" size="sm">
                Approve current terms
              </Button>
            </form>
          ) : null}
        </div>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Button href="/admin/organisations/new" size="sm">
          New organisation
        </Button>
        <Button href="/admin/bookings/new" size="sm" variant="ghost">
          New draft booking
        </Button>
      </div>

      <section className="mt-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl text-white">Recent bookings</h2>
          <Link href="/admin/bookings" className="text-sm text-accent">
            View all
          </Link>
        </div>
        {bookings && bookings.length > 0 ? (
          <ul className="divide-y divide-white/10 rounded-3xl border border-white/10">
            {bookings.map((booking) => {
              const org = Array.isArray(booking.organisations)
                ? booking.organisations[0]
                : booking.organisations;
              return (
                <li key={booking.id} className="px-5 py-4">
                  <Link href={`/admin/bookings/${booking.id}`} className="block hover:text-accent">
                    <p className="text-white">
                      {booking.reference} · {org?.legal_name || "Organisation"}
                    </p>
                    <p className="mt-1 text-sm text-white/50">
                      {booking.status} · {booking.invitation_status} · {formatEur(booking.total_inc_vat)}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-white/55">No bookings yet.</p>
        )}
      </section>
    </AdminChrome>
  );
}
