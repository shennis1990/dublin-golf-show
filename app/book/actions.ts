"use server";

import { writeAdminAudit } from "@/lib/booking/audit";
import {
  isInviteOpen,
  loadCurrentApprovedTerms,
  loadInviteByToken,
} from "@/lib/booking/invite";
import { getRequestIp, getRequestUserAgent } from "@/lib/booking/request";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export type SignFormState = {
  error: string;
  signed: boolean;
  values: {
    signerName: string;
    signerRole: string;
    detailsConfirmed: boolean;
    authorisedConfirmed: boolean;
    termsConfirmed: boolean;
  };
};

export async function submitBookingSignature(
  _prev: SignFormState | null,
  formData: FormData,
): Promise<SignFormState> {
  const values = {
    signerName: String(formData.get("signerName") || "").trim(),
    signerRole: String(formData.get("signerRole") || "").trim(),
    detailsConfirmed: formData.get("detailsConfirmed") === "on",
    authorisedConfirmed: formData.get("authorisedConfirmed") === "on",
    termsConfirmed: formData.get("termsConfirmed") === "on",
  };
  const token = String(formData.get("token") || "");

  if (values.signerName.length < 2 || values.signerName.length > 120) {
    return { error: "Enter the signer's full name.", signed: false, values };
  }
  if (values.signerRole.length < 2 || values.signerRole.length > 80) {
    return { error: "Enter the signer's role.", signed: false, values };
  }
  if (!values.detailsConfirmed || !values.authorisedConfirmed || !values.termsConfirmed) {
    return {
      error: "All three confirmations are required before signing.",
      signed: false,
      values,
    };
  }

  let invite;
  try {
    invite = await loadInviteByToken(token);
  } catch {
    return {
      error: "Booking signing is temporarily unavailable. Your details have been kept — try again.",
      signed: false,
      values,
    };
  }

  if (!invite || !isInviteOpen(invite)) {
    return {
      error: "This booking link is invalid, expired, or already used.",
      signed: false,
      values,
    };
  }

  const terms = await loadCurrentApprovedTerms();
  if (!terms) {
    return {
      error: "Agreement terms are not approved yet. Please wait for the organiser to confirm.",
      signed: false,
      values,
    };
  }

  const supabase = getSupabaseAdmin();
  const signedAt = new Date().toISOString();
  const ip = await getRequestIp();
  const userAgent = await getRequestUserAgent();

  const bookingSnapshot = {
    reference: invite.booking.reference,
    category: invite.booking.category,
    package_name: invite.booking.package_name,
    stand_width_m: invite.booking.stand_width_m,
    stand_depth_m: invite.booking.stand_depth_m,
    price_ex_vat: invite.booking.price_ex_vat,
    vat_rate: invite.booking.vat_rate,
    vat_amount: invite.booking.vat_amount,
    total_inc_vat: invite.booking.total_inc_vat,
    deposit_percent: invite.booking.deposit_percent,
    deposit_amount: invite.booking.deposit_amount,
    balance_amount: invite.booking.balance_amount,
    organisation: invite.organisation,
  };

  const { error: agreementError } = await supabase.from("booking_agreements").insert({
    booking_id: invite.booking.id,
    terms_version_id: terms.id,
    signer_name: values.signerName,
    signer_role: values.signerRole,
    signer_ip: ip,
    user_agent: userAgent,
    confirmation_details_accurate: true,
    confirmation_authority_to_sign: true,
    confirmation_terms_accepted: true,
    typed_signature: values.signerName,
    signed_at: signedAt,
    terms_snapshot: terms.body_markdown,
    booking_snapshot: bookingSnapshot,
  });

  if (agreementError) {
    if (agreementError.code === "23505") {
      return {
        error: "This booking has already been signed.",
        signed: false,
        values,
      };
    }
    return {
      error: "Could not save the signed agreement. Your details have been kept — try again.",
      signed: false,
      values,
    };
  }

  const { error: bookingUpdateError } = await supabase
    .from("bookings")
    .update({
      status: "signed",
      invitation_status: "used",
      signed_at: signedAt,
    })
    .eq("id", invite.booking.id)
    .in("status", ["draft", "awaiting_completion"]);

  if (bookingUpdateError) {
    console.error("booking status update failed after agreement insert:", bookingUpdateError.message);
  }

  await supabase
    .from("booking_tokens")
    .update({ revoked_at: signedAt })
    .eq("id", invite.tokenId)
    .is("revoked_at", null);

  await writeAdminAudit(supabase, {
    actorId: null,
    action: "booking.signed",
    entityType: "booking",
    entityId: invite.booking.id,
    metadata: { signer_role: values.signerRole, terms_version_id: terms.id },
  });

  return { error: "", signed: true, values };
}
