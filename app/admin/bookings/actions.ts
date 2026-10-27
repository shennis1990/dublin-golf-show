"use server";

import { redirect } from "next/navigation";
import { Resend } from "resend";
import { requireAdmin } from "@/lib/auth/require-admin";
import { writeAdminAudit } from "@/lib/booking/audit";
import { calculateBookingAmounts, parseMoney } from "@/lib/booking/calc";
import { createBookingInviteToken, createBookingReference } from "@/lib/booking/token";
import { siteConfig } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";

export type BookingFormState = {
  error: string;
  values: {
    organisationId: string;
    category: string;
    packageName: string;
    standWidth: string;
    standDepth: string;
    priceExVat: string;
  };
};

const EVENT_SLUG = "dublin-golf-show-2027";
const CATEGORIES = new Set(["exhibitor", "sponsor"]);

function readBookingForm(formData: FormData): BookingFormState["values"] {
  return {
    organisationId: String(formData.get("organisationId") || "").trim(),
    category: String(formData.get("category") || "exhibitor").trim(),
    packageName: String(formData.get("packageName") || "").trim(),
    standWidth: String(formData.get("standWidth") || "").trim(),
    standDepth: String(formData.get("standDepth") || "").trim(),
    priceExVat: String(formData.get("priceExVat") || "").trim(),
  };
}


export async function createBooking(
  _prev: BookingFormState | null,
  formData: FormData,
): Promise<BookingFormState> {
  const session = await requireAdmin();
  const values = readBookingForm(formData);

  if (!values.organisationId) {
    return { error: "Choose an organisation.", values };
  }
  if (!CATEGORIES.has(values.category)) {
    return { error: "Choose exhibitor or sponsor.", values };
  }
  if (values.packageName.length < 2) {
    return { error: "Enter a package name.", values };
  }

  const priceExVat = parseMoney(values.priceExVat);
  if (priceExVat === null || priceExVat <= 0) {
    return { error: "Enter a price excluding VAT greater than zero.", values };
  }

  const width = values.standWidth ? parseMoney(values.standWidth) : null;
  const depth = values.standDepth ? parseMoney(values.standDepth) : null;
  if (values.standWidth && (width === null || width <= 0)) {
    return { error: "Stand width must be a positive number.", values };
  }
  if (values.standDepth && (depth === null || depth <= 0)) {
    return { error: "Stand depth must be a positive number.", values };
  }

  const supabase = await createClient();

  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("id, year, default_vat_rate, default_deposit_percent")
    .eq("slug", EVENT_SLUG)
    .maybeSingle();

  if (eventError || !event) {
    return { error: "The 2027 event is not available. Booking cannot be created.", values };
  }

  const { data: terms, error: termsError } = await supabase
    .from("agreement_terms_versions")
    .select("id")
    .eq("is_current", true)
    .maybeSingle();

  if (termsError || !terms) {
    return { error: "No current agreement terms version exists.", values };
  }

  let amounts;
  try {
    amounts = calculateBookingAmounts({
      priceExVat,
      vatRate: Number(event.default_vat_rate),
      depositPercent: Number(event.default_deposit_percent),
    });
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Could not calculate booking amounts.",
      values,
    };
  }

  let bookingId: string | null = null;
  let lastError: string | null = null;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const { data, error } = await supabase
      .from("bookings")
      .insert({
        event_id: event.id,
        organisation_id: values.organisationId,
        terms_version_id: terms.id,
        reference: createBookingReference(event.year),
        category: values.category,
        package_name: values.packageName,
        stand_width_m: width,
        stand_depth_m: depth,
        price_ex_vat: amounts.priceExVat,
        vat_rate: amounts.vatRate,
        vat_amount: amounts.vatAmount,
        total_inc_vat: amounts.totalIncVat,
        deposit_percent: amounts.depositPercent,
        deposit_amount: amounts.depositAmount,
        balance_amount: amounts.balanceAmount,
        status: "draft",
        invitation_status: "not_sent",
      })
      .select("id")
      .single();

    if (!error && data) {
      bookingId = data.id;
      break;
    }
    lastError = error?.message || "insert failed";
    if (error?.code !== "23505") break;
  }

  if (!bookingId) {
    return {
      error: lastError
        ? "Could not save the booking. Check the organisation and try again."
        : "Could not save the booking.",
      values,
    };
  }

  const { error: paymentError } = await supabase.from("booking_payments").insert([
    {
      booking_id: bookingId,
      kind: "deposit",
      amount: amounts.depositAmount,
      status: "outstanding",
    },
    {
      booking_id: bookingId,
      kind: "balance",
      amount: amounts.balanceAmount,
      status: "outstanding",
    },
  ]);

  if (paymentError) {
    console.error("booking_payments insert failed:", paymentError.message);
  }

  await writeAdminAudit(supabase, {
    actorId: session.user.id,
    action: "booking.created",
    entityType: "booking",
    entityId: bookingId,
    metadata: { total_inc_vat: amounts.totalIncVat },
  });

  redirect(`/admin/bookings/${bookingId}`);
}

export type InviteState = {
  error: string;
  url: string;
  emailed: boolean;
};


export async function generateBookingInvite(
  _prev: InviteState | null,
  formData: FormData,
): Promise<InviteState> {
  const session = await requireAdmin();
  const bookingId = String(formData.get("bookingId") || "").trim();
  if (!bookingId) {
    return { error: "Missing booking.", url: "", emailed: false };
  }

  const supabase = await createClient();
  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .select(
      "id, status, events(default_token_expiry_days), organisations(legal_name, primary_contact_email)",
    )
    .eq("id", bookingId)
    .maybeSingle();

  if (bookingError || !booking) {
    return { error: "Booking not found.", url: "", emailed: false };
  }

  if (booking.status === "signed" || booking.status === "cancelled") {
    return {
      error: "This booking can no longer be invited.",
      url: "",
      emailed: false,
    };
  }

  const event = unwrapOne(booking.events);
  const organisation = unwrapOne(booking.organisations);
  const expiryDays = Number(event?.default_token_expiry_days || 30);
  const { token, tokenHash } = createBookingInviteToken();
  const expiresAt = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000).toISOString();

  const { error: revokeError } = await supabase
    .from("booking_tokens")
    .update({ revoked_at: new Date().toISOString() })
    .eq("booking_id", bookingId)
    .is("revoked_at", null);

  if (revokeError) {
    return { error: "Could not replace the previous invitation.", url: "", emailed: false };
  }

  const { error: tokenError } = await supabase.from("booking_tokens").insert({
    booking_id: bookingId,
    token_hash: tokenHash,
    expires_at: expiresAt,
  });

  if (tokenError) {
    return { error: "Could not create the invitation. Try again.", url: "", emailed: false };
  }

  const nextStatus = booking.status === "draft" ? "awaiting_completion" : booking.status;
  await supabase
    .from("bookings")
    .update({
      status: nextStatus,
      invitation_status: "sent",
    })
    .eq("id", bookingId);

  const url = `${siteConfig.url}/book/${token}`;
  let emailed = false;
  const contactEmail = organisation?.primary_contact_email;

  if (contactEmail) {
    emailed = await sendInviteEmail(
      contactEmail,
      url,
      organisation?.legal_name || "your organisation",
    );
  }

  await writeAdminAudit(supabase, {
    actorId: session.user.id,
    action: "booking.invite_generated",
    entityType: "booking",
    entityId: bookingId,
    metadata: { emailed, expires_at: expiresAt },
  });

  return { error: "", url, emailed };
}

export async function approveCurrentTerms() {
  const session = await requireAdmin();
  const supabase = await createClient();

  const { data: terms, error } = await supabase
    .from("agreement_terms_versions")
    .select("id, status")
    .eq("is_current", true)
    .maybeSingle();

  if (error || !terms) {
    redirect("/admin?error=terms");
  }

  if (terms.status !== "approved") {
    const { error: updateError } = await supabase
      .from("agreement_terms_versions")
      .update({
        status: "approved",
        approved_at: new Date().toISOString(),
        approved_by: session.user.id,
      })
      .eq("id", terms.id);

    if (updateError) {
      redirect("/admin?error=terms");
    }

    await writeAdminAudit(supabase, {
      actorId: session.user.id,
      action: "terms.approved",
      entityType: "agreement_terms_version",
      entityId: terms.id,
    });
  }

  redirect("/admin");
}

function unwrapOne<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? value[0] || null : value;
}

async function sendInviteEmail(to: string, url: string, orgName: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  try {
    const resend = new Resend(apiKey);
    const from =
      process.env.RESEND_FROM_EMAIL ||
      "Dublin Golf Show <onboarding@resend.dev>";
    const { error } = await resend.emails.send({
      from,
      to: [to],
      subject: `Complete your Dublin Golf Show 2027 booking — ${orgName}`,
      text: [
        `Hello,`,
        ``,
        `Please review and sign the Dublin Golf Show 2027 booking agreement for ${orgName}.`,
        ``,
        url,
        ``,
        `This link is single-use and will expire.`,
      ].join("\n"),
    });
    return !error;
  } catch (error) {
    console.error("Invite email failed:", error);
    return false;
  }
}
