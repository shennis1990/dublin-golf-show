import { Resend } from "resend";
import { NextResponse } from "next/server";

const NOTIFY_EMAIL =
  process.env.INTEREST_NOTIFY_EMAIL || "shane.ennis90@gmail.com";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      company?: string;
    };

    // Honeypot — bots fill hidden fields
    if (body.company?.trim()) {
      return NextResponse.json({ ok: true });
    }

    const name = body.name?.trim() ?? "";
    const email = body.email?.trim().toLowerCase() ?? "";

    if (!name || name.length < 2) {
      return NextResponse.json(
        { error: "Please enter your name." },
        { status: 400 },
      );
    }

    if (!email || !emailPattern.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json(
        {
          error:
            "Interest registration is temporarily unavailable. Please email hello@dublingolfshow.ie.",
        },
        { status: 503 },
      );
    }

    const resend = new Resend(apiKey);
    const from =
      process.env.RESEND_FROM_EMAIL ||
      "Dublin Golf Show <onboarding@resend.dev>";

    const { error } = await resend.emails.send({
      from,
      to: [NOTIFY_EMAIL],
      replyTo: email,
      subject: `Register Interest — ${name}`,
      text: [
        "New Register Interest submission",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        "",
        `Submitted: ${new Date().toISOString()}`,
      ].join("\n"),
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0A111C">
          <h2 style="margin:0 0 12px">New Register Interest submission</h2>
          <p style="margin:0 0 8px"><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p style="margin:0 0 8px"><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p style="margin:16px 0 0;color:#555;font-size:12px">Submitted: ${new Date().toISOString()}</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Unable to send your registration right now. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
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
