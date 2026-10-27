import { hashBookingToken } from "@/lib/booking/token";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export type InviteBooking = {
  tokenId: string;
  tokenRevokedAt: string | null;
  tokenExpiresAt: string;
  booking: {
    id: string;
    reference: string;
    category: string;
    package_name: string;
    stand_width_m: number | string | null;
    stand_depth_m: number | string | null;
    status: string;
    price_ex_vat: number | string;
    vat_rate: number | string;
    vat_amount: number | string;
    total_inc_vat: number | string;
    deposit_percent: number | string;
    deposit_amount: number | string;
    balance_amount: number | string;
    signed_at: string | null;
  };
  organisation: {
    legal_name: string;
    trading_name: string | null;
    primary_contact_name: string;
    primary_contact_email: string;
  };
};

function unwrapOne<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? value[0] || null : value;
}

export async function loadInviteByToken(rawToken: string): Promise<InviteBooking | null> {
  const token = rawToken.trim();
  if (!token || token.length < 20 || token.length > 128) return null;

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("booking_tokens")
    .select(
      "id, revoked_at, expires_at, bookings(id, reference, category, package_name, stand_width_m, stand_depth_m, status, price_ex_vat, vat_rate, vat_amount, total_inc_vat, deposit_percent, deposit_amount, balance_amount, signed_at, organisations(legal_name, trading_name, primary_contact_name, primary_contact_email))",
    )
    .eq("token_hash", hashBookingToken(token))
    .maybeSingle();

  if (error || !data) return null;

  const booking = unwrapOne(data.bookings);
  const organisation = unwrapOne(booking?.organisations);
  if (!booking || !organisation) return null;

  return {
    tokenId: data.id,
    tokenRevokedAt: data.revoked_at,
    tokenExpiresAt: data.expires_at,
    booking: {
      id: booking.id,
      reference: booking.reference,
      category: booking.category,
      package_name: booking.package_name,
      stand_width_m: booking.stand_width_m,
      stand_depth_m: booking.stand_depth_m,
      status: booking.status,
      price_ex_vat: booking.price_ex_vat,
      vat_rate: booking.vat_rate,
      vat_amount: booking.vat_amount,
      total_inc_vat: booking.total_inc_vat,
      deposit_percent: booking.deposit_percent,
      deposit_amount: booking.deposit_amount,
      balance_amount: booking.balance_amount,
      signed_at: booking.signed_at,
    },
    organisation: {
      legal_name: organisation.legal_name,
      trading_name: organisation.trading_name,
      primary_contact_name: organisation.primary_contact_name,
      primary_contact_email: organisation.primary_contact_email,
    },
  };
}

export async function loadCurrentApprovedTerms() {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("agreement_terms_versions")
    .select("id, version_number, status, title, body_markdown, is_current")
    .eq("is_current", true)
    .maybeSingle();

  if (!data || data.status !== "approved") return null;
  return data;
}

export function isInviteOpen(invite: InviteBooking) {
  if (invite.booking.status === "signed") return false;
  if (invite.booking.status === "cancelled") return false;
  if (invite.tokenRevokedAt) return false;
  if (new Date(invite.tokenExpiresAt).getTime() <= Date.now()) return false;
  return true;
}
