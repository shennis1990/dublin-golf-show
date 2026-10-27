import Link from "next/link";
import { AdminChrome } from "@/components/admin/AdminChrome";
import { Button } from "@/components/ui/Button";
import { requireAdmin } from "@/lib/auth/require-admin";
import { formatEur } from "@/lib/booking/calc";
import { createClient } from "@/lib/supabase/server";

export default async function BookingsPage() {
  const session = await requireAdmin();
  const supabase = await createClient();
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select(
      "id, reference, category, package_name, status, invitation_status, total_inc_vat, created_at, organisations(legal_name)",
    )
    .order("created_at", { ascending: false });

  return (
    <AdminChrome email={session.user.email || ""} role={session.role}>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-white">Bookings</h1>
          <p className="mt-2 text-white/55">Draft bookings, invitations, and signed agreements.</p>
        </div>
        <Button href="/admin/bookings/new" size="sm">
          New booking
        </Button>
      </div>

      {error ? (
        <p className="text-red-200" role="alert">
          Could not load bookings.
        </p>
      ) : bookings && bookings.length > 0 ? (
        <ul className="divide-y divide-white/10 rounded-3xl border border-white/10">
          {bookings.map((booking) => {
            const org = Array.isArray(booking.organisations)
              ? booking.organisations[0]
              : booking.organisations;
            return (
              <li key={booking.id} className="px-5 py-4">
                <Link href={`/admin/bookings/${booking.id}`} className="block hover:text-accent">
                  <p className="font-medium text-white">
                    {booking.reference} · {org?.legal_name || "Organisation"}
                  </p>
                  <p className="mt-1 text-sm text-white/50">
                    {booking.category} · {booking.package_name} · {booking.status} ·{" "}
                    {formatEur(booking.total_inc_vat)}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-white/55">
          No bookings yet.{" "}
          <Link href="/admin/bookings/new" className="text-accent">
            Create a draft booking
          </Link>
          .
        </p>
      )}
    </AdminChrome>
  );
}
