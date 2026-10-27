import { notFound } from "next/navigation";
import { AdminChrome } from "@/components/admin/AdminChrome";
import { requireAdmin } from "@/lib/auth/require-admin";
import { formatEur } from "@/lib/booking/calc";
import { createClient } from "@/lib/supabase/server";
import { InviteForm } from "../InviteForm";

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireAdmin();
  const { id } = await params;
  const supabase = await createClient();

  const { data: booking } = await supabase
    .from("bookings")
    .select(
      "id, reference, category, package_name, stand_width_m, stand_depth_m, status, invitation_status, price_ex_vat, vat_rate, vat_amount, total_inc_vat, deposit_percent, deposit_amount, balance_amount, signed_at, organisations(legal_name, primary_contact_name, primary_contact_email), booking_agreements(id, signed_at, signer_name, signer_role), booking_tokens(id, expires_at, revoked_at, created_at)",
    )
    .eq("id", id)
    .maybeSingle();

  if (!booking) notFound();

  const organisation = Array.isArray(booking.organisations)
    ? booking.organisations[0]
    : booking.organisations;
  const agreements = Array.isArray(booking.booking_agreements)
    ? booking.booking_agreements
    : booking.booking_agreements
      ? [booking.booking_agreements]
      : [];
  const tokens = (Array.isArray(booking.booking_tokens)
    ? booking.booking_tokens
    : booking.booking_tokens
      ? [booking.booking_tokens]
      : []
  ).sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  const activeToken = tokens.find((token) => !token.revoked_at);

  return (
    <AdminChrome email={session.user.email || ""} role={session.role}>
      <p className="mb-2 text-sm uppercase tracking-[0.12em] text-white/40">{booking.reference}</p>
      <h1 className="font-display text-3xl font-semibold text-white">
        {organisation?.legal_name || "Booking"}
      </h1>
      <p className="mt-2 text-white/55">
        {booking.category} · {booking.package_name} · {booking.status} · invitation {booking.invitation_status}
      </p>

      <dl className="mt-8 grid gap-4 rounded-3xl border border-white/10 p-6 sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-[0.12em] text-white/40">Contact</dt>
          <dd className="mt-1 text-white">
            {organisation?.primary_contact_name} · {organisation?.primary_contact_email}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.12em] text-white/40">Stand</dt>
          <dd className="mt-1 text-white">
            {booking.stand_width_m && booking.stand_depth_m
              ? `${booking.stand_width_m}m × ${booking.stand_depth_m}m`
              : "Not set"}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.12em] text-white/40">Price ex VAT</dt>
          <dd className="mt-1 text-white">{formatEur(booking.price_ex_vat)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.12em] text-white/40">VAT {booking.vat_rate}%</dt>
          <dd className="mt-1 text-white">{formatEur(booking.vat_amount)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.12em] text-white/40">Total inc VAT</dt>
          <dd className="mt-1 text-white">{formatEur(booking.total_inc_vat)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.12em] text-white/40">
            Deposit {booking.deposit_percent}%
          </dt>
          <dd className="mt-1 text-white">{formatEur(booking.deposit_amount)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.12em] text-white/40">Balance</dt>
          <dd className="mt-1 text-white">{formatEur(booking.balance_amount)}</dd>
        </div>
      </dl>

      <section className="mt-10 space-y-4">
        <h2 className="font-display text-xl text-white">Invitation</h2>
        {booking.status === "signed" ? (
          <p className="text-white/55">This booking is signed. No further invitation is needed.</p>
        ) : (
          <>
            {activeToken ? (
              <p className="text-sm text-white/50">
                An invitation is active until {new Date(activeToken.expires_at).toLocaleString("en-IE")}.
                Creating a new link revokes the previous one. The raw link is shown once after you create it.
              </p>
            ) : (
              <p className="text-sm text-white/50">
                Create a single-use link. It is hashed in the database; copy it from the box after creation if
                email is unavailable.
              </p>
            )}
            <InviteForm bookingId={booking.id} />
          </>
        )}
      </section>

      {agreements[0] ? (
        <section className="mt-10">
          <h2 className="font-display text-xl text-white">Signed agreement</h2>
          <p className="mt-2 text-white/55">
            {agreements[0].signer_name}, {agreements[0].signer_role},{" "}
            {new Date(agreements[0].signed_at).toLocaleString("en-IE")}
          </p>
        </section>
      ) : null}
    </AdminChrome>
  );
}
