import { Resend } from "resend";
import { NextResponse } from "next/server";
import { MARKETING_CONSENT_TEXT } from "@/lib/consent";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const NOTIFY_EMAIL =
  process.env.INTEREST_NOTIFY_EMAIL || "shane.ennis90@gmail.com";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      firstName?: string;
      lastName?: string;
      email?: string;
      company?: string;
      consent?: boolean;
    };

    // Honeypot — bots fill hidden fields
    if (body.company?.trim()) {
      return NextResponse.json({ ok: true });
    }

    const firstName = body.firstName?.trim() ?? "";
    const lastName = body.lastName?.trim() ?? "";
    const email = body.email?.trim().toLowerCase() ?? "";

    if (!firstName || firstName.length < 2) {
      return NextResponse.json(
        { error: "Please enter your first name." },
        { status: 400 },
      );
    }

    if (!lastName || lastName.length < 2) {
      return NextResponse.json(
        { error: "Please enter your last name." },
        { status: 400 },
      );
    }

    if (!email || !emailPattern.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    if (body.consent !== true) {
      return NextResponse.json(
        {
          error:
            "Please confirm you agree to be contacted about tickets and marketing updates.",
        },
        { status: 400 },
      );
    }

    const consentAt = new Date().toISOString();

    try {
      const supabase = getSupabaseAdmin();
      const { error: dbError } = await supabase.from("interest_leads").upsert(
        {
          first_name: firstName,
          last_name: lastName,
          email,
          consent_marketing: true,
          consent_text: MARKETING_CONSENT_TEXT,
          consent_at: consentAt,
          source: "register-interest",
        },
        { onConflict: "email" },
      );

      if (dbError) {
        console.error("Supabase error:", dbError);
        return NextResponse.json(
          {
            error:
              "Unable to save your registration right now. Please try again.",
          },
          { status: 502 },
        );
      }
    } catch (dbSetupError) {
      console.error("Supabase setup error:", dbSetupError);
      return NextResponse.json(
        {
          error:
            "Interest registration is temporarily unavailable. Please email hello@dublingolfshow.ie.",
        },
        { status: 503 },
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY is not configured");
      // Lead is already stored — still treat as success for the visitor
      return NextResponse.json({ ok: true, emailed: false });
    }

    const resend = new Resend(apiKey);
    const from =
      process.env.RESEND_FROM_EMAIL ||
      "Dublin Golf Show <onboarding@resend.dev>";
    const fullName = `${firstName} ${lastName}`;

    const { error } = await resend.emails.send({
      from,
      to: [NOTIFY_EMAIL],
      replyTo: email,
      subject: `Register Interest — ${fullName}`,
      text: [
        "New Register Interest submission",
        "",
        `First name: ${firstName}`,
        `Last name: ${lastName}`,
        `Email: ${email}`,
        "Marketing consent: Yes — ticketing and marketing contact agreed",
        "",
        `Submitted: ${consentAt}`,
      ].join("\n"),
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0A111C">
          <h2 style="margin:0 0 12px">New Register Interest submission</h2>
          <p style="margin:0 0 8px"><strong>First name:</strong> ${escapeHtml(firstName)}</p>
          <p style="margin:0 0 8px"><strong>Last name:</strong> ${escapeHtml(lastName)}</p>
          <p style="margin:0 0 8px"><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p style="margin:0 0 8px"><strong>Marketing consent:</strong> Yes — ticketing and marketing contact agreed</p>
          <p style="margin:16px 0 0;color:#555;font-size:12px">Submitted: ${consentAt}</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      // Lead saved — don't fail the user experience on notify-email issues
      return NextResponse.json({ ok: true, emailed: false });
    }

    return NextResponse.json({ ok: true, emailed: true });
  } catch (error) {
    console.error("register-interest error:", error);
    return NextResponse.json(
      { error: "Unable to send your registration right now. Please try again." },
      { status: 500 },
    );
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
