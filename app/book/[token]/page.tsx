import type { Metadata } from "next";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { Contour } from "@/components/ui/Contour";
import { formatEur } from "@/lib/booking/calc";
import {
  isInviteOpen,
  loadCurrentApprovedTerms,
  loadInviteByToken,
} from "@/lib/booking/invite";
import { SignForm } from "./SignForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Booking agreement",
  robots: { index: false, follow: false },
};

function InvalidLink() {
  return (
    <BookShell>
      <h1 className="font-display text-3xl font-semibold text-white">Booking link unavailable</h1>
      <p className="mt-4 text-white/60">
        This booking link is invalid, expired, or has already been used. Contact the Dublin Golf Show
        organiser if you need a new invitation.
      </p>
    </BookShell>
  );
}

function BookShell({ children }: { children: React.ReactNode }) {
  return (
    <main
      id="main-content"
      className="relative min-h-[100svh] overflow-hidden bg-background"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <Contour anchor="top-right" opacity={0.08} />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-3xl px-6 py-10 md:px-10">
        <BrandLogo />
        <div className="mt-10">{children}</div>
      </div>
    </main>
  );
}

export default async function BookingInvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  let invite;
  try {
    invite = await loadInviteByToken(token);
  } catch {
    return (
      <BookShell>
        <h1 className="font-display text-3xl font-semibold text-white">Temporarily unavailable</h1>
        <p className="mt-4 text-white/60">
          The booking service could not be reached. Keep this page and try again shortly.
        </p>
      </BookShell>
    );
  }

  if (!invite || invite.booking.status === "cancelled") {
    return <InvalidLink />;
  }

  const alreadySigned = invite.booking.status === "signed";
  const open = isInviteOpen(invite);
  if (!alreadySigned && !open) {
    return <InvalidLink />;
  }

  const terms = alreadySigned ? null : await loadCurrentApprovedTerms();

  return (
    <BookShell>
      <p className="text-sm uppercase tracking-[0.12em] text-white/40">{invite.booking.reference}</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-white">
        {invite.organisation.legal_name}
      </h1>
      <p className="mt-2 text-white/55">
        Dublin Golf Show 2027 · {invite.booking.category} · {invite.booking.package_name}
      </p>

      <dl className="mt-8 grid gap-4 rounded-3xl border border-white/10 p-6 sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-[0.12em] text-white/40">Contact</dt>
          <dd className="mt-1 text-white">
            {invite.organisation.primary_contact_name} · {invite.organisation.primary_contact_email}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.12em] text-white/40">Stand</dt>
          <dd className="mt-1 text-white">
            {invite.booking.stand_width_m && invite.booking.stand_depth_m
              ? `${invite.booking.stand_width_m}m × ${invite.booking.stand_depth_m}m`
              : "Not set"}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.12em] text-white/40">Price ex VAT</dt>
          <dd className="mt-1 text-white">{formatEur(invite.booking.price_ex_vat)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.12em] text-white/40">
            VAT {invite.booking.vat_rate}%
          </dt>
          <dd className="mt-1 text-white">{formatEur(invite.booking.vat_amount)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.12em] text-white/40">Total inc VAT</dt>
          <dd className="mt-1 text-white">{formatEur(invite.booking.total_inc_vat)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.12em] text-white/40">
            Deposit {invite.booking.deposit_percent}%
          </dt>
          <dd className="mt-1 text-white">{formatEur(invite.booking.deposit_amount)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.12em] text-white/40">Balance</dt>
          <dd className="mt-1 text-white">{formatEur(invite.booking.balance_amount)}</dd>
        </div>
      </dl>

      {alreadySigned ? (
        <p className="mt-8 rounded-3xl border border-accent/40 bg-accent/10 px-5 py-4 text-white">
          This agreement has already been signed
          {invite.booking.signed_at
            ? ` on ${new Date(invite.booking.signed_at).toLocaleString("en-IE")}`
            : ""}
          .
        </p>
      ) : !terms ? (
        <p className="mt-8 text-white/60">
          Agreement terms are not approved yet. You can keep this page and return once the organiser
          has approved the terms.
        </p>
      ) : (
        <>
          <section className="mt-10">
            <h2 className="font-display text-xl text-white">{terms.title}</h2>
            <p className="mt-1 text-sm text-white/40">Version {terms.version_number}</p>
            <div className="mt-4 whitespace-pre-wrap rounded-3xl border border-white/10 p-6 text-sm leading-relaxed text-white/75">
              {terms.body_markdown}
            </div>
          </section>
          <section className="mt-10">
            <h2 className="mb-6 font-display text-xl text-white">Sign</h2>
            <SignForm token={token} />
          </section>
        </>
      )}
    </BookShell>
  );
}
