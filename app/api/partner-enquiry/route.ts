import { Resend } from "resend";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const NOTIFY_EMAIL =
  process.env.PARTNER_NOTIFY_EMAIL ||
  process.env.INTEREST_NOTIFY_EMAIL ||
  "shane.ennis90@gmail.com";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+()\d\s.-]{7,20}$/;

const MIN_FILL_MS = 2_500;
const MAX_SUBMISSIONS_PER_IP_PER_HOUR = 5;
const EMAIL_NOTIFY_COOLDOWN_MS = 24 * 60 * 60 * 1_000;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      firstName?: string;
      lastName?: string;
      email?: string;
      companyName?: string;
      phone?: string;
      website?: string;
      openedAt?: number;
    };

    // Honeypot
    if (body.website?.trim()) {
      return NextResponse.json({ ok: true });
    }

    const openedAt =
      typeof body.openedAt === "number" ? body.openedAt : Number.NaN;
    if (!Number.isFinite(openedAt) || Date.now() - openedAt < MIN_FILL_MS) {
      return NextResponse.json(
        { error: "Please take a moment to complete the form, then try again." },
        { status: 400 },
      );
    }

    const firstName = body.firstName?.trim() ?? "";
    const lastName = body.lastName?.trim() ?? "";
    const email = body.email?.trim().toLowerCase() ?? "";
    const companyName = body.companyName?.trim() ?? "";
    const phone = body.phone?.trim() ?? "";

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

    if (!companyName || companyName.length < 2) {
      return NextResponse.json(
        { error: "Please enter your company name." },
        { status: 400 },
      );
    }

    if (!email || !emailPattern.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    if (!phone || !phonePattern.test(phone)) {
      return NextResponse.json(
        { error: "Please enter a valid phone number." },
        { status: 400 },
      );
    }

    const submittedAt = new Date().toISOString();
    const ipAddress = getClientIp(request);
    let shouldNotify = true;

    try {
      const supabase = getSupabaseAdmin();

      const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const { count, error: rateCountError } = await supabase
        .from("partner_rate_events")
        .select("id", { count: "exact", head: true })
        .eq("ip_address", ipAddress)
        .gte("created_at", hourAgo);

      if (rateCountError) {
        console.error("Partner rate count error:", rateCountError);
        return NextResponse.json(
          {
            error:
              "Unable to save your enquiry right now. Please try again.",
          },
          { status: 502 },
        );
      }

      if ((count ?? 0) >= MAX_SUBMISSIONS_PER_IP_PER_HOUR) {
        return NextResponse.json(
          {
            error:
              "Too many submissions from this connection. Please try again later.",
          },
          { status: 429 },
        );
      }

      const { error: rateInsertError } = await supabase
        .from("partner_rate_events")
        .insert({
          ip_address: ipAddress,
          email,
        });

      if (rateInsertError) {
        console.error("Partner rate insert error:", rateInsertError);
        return NextResponse.json(
          {
            error:
              "Unable to save your enquiry right now. Please try again.",
          },
          { status: 502 },
        );
      }

      const { data: existing } = await supabase
        .from("partner_leads")
        .select("last_notified_at")
        .eq("email", email)
        .maybeSingle();

      if (existing?.last_notified_at) {
        const lastNotified = new Date(existing.last_notified_at).getTime();
        if (Date.now() - lastNotified < EMAIL_NOTIFY_COOLDOWN_MS) {
          shouldNotify = false;
        }
      }

      const { error: dbError } = await supabase.from("partner_leads").upsert(
        {
          first_name: firstName,
          last_name: lastName,
          email,
          company_name: companyName,
          phone,
          source: "partner-with-us",
          ip_address: ipAddress,
        },
        { onConflict: "email" },
      );

      if (dbError) {
        console.error("Partner Supabase error:", dbError);
        return NextResponse.json(
          {
            error:
              "Unable to save your enquiry right now. Please try again.",
            code: dbError.code || "SUPABASE_WRITE_FAILED",
          },
          { status: 502 },
        );
      }
    } catch (dbSetupError) {
      console.error("Partner Supabase setup error:", dbSetupError);
      return NextResponse.json(
        {
          error:
            "Partner enquiries are temporarily unavailable. Please email hello@dublingolfshow.ie.",
        },
        { status: 503 },
      );
    }

    if (!shouldNotify) {
      return NextResponse.json({ ok: true, emailed: false });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY is not configured");
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
      subject: `Partner Enquiry — ${companyName}`,
      text: [
        "New Partner With Us enquiry",
        "",
        `First name: ${firstName}`,
        `Last name: ${lastName}`,
        `Company: ${companyName}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        "",
        `Submitted: ${submittedAt}`,
      ].join("\n"),
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0A111C">
          <h2 style="margin:0 0 12px">New Partner With Us enquiry</h2>
          <p style="margin:0 0 8px"><strong>First name:</strong> ${escapeHtml(firstName)}</p>
          <p style="margin:0 0 8px"><strong>Last name:</strong> ${escapeHtml(lastName)}</p>
          <p style="margin:0 0 8px"><strong>Company:</strong> ${escapeHtml(companyName)}</p>
          <p style="margin:0 0 8px"><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p style="margin:0 0 8px"><strong>Phone:</strong> ${escapeHtml(phone)}</p>
          <p style="margin:16px 0 0;color:#555;font-size:12px">Submitted: ${submittedAt}</p>
        </div>
      `,
    });

    if (error) {
      console.error("Partner Resend error:", error);
      return NextResponse.json({ ok: true, emailed: false });
    }

    try {
      const supabase = getSupabaseAdmin();
      await supabase
        .from("partner_leads")
        .update({ last_notified_at: new Date().toISOString() })
        .eq("email", email);
    } catch (notifyUpdateError) {
      console.error("Partner notify timestamp update error:", notifyUpdateError);
    }

    return NextResponse.json({ ok: true, emailed: true });
  } catch (error) {
    console.error("partner-enquiry error:", error);
    return NextResponse.json(
      { error: "Unable to send your enquiry right now. Please try again." },
      { status: 500 },
    );
  }
}

function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  return (
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("cf-connecting-ip")?.trim() ||
    "unknown"
  );
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
