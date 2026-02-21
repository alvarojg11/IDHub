import { NextRequest, NextResponse } from "next/server";

import { sendContactEmail } from "@/lib/subscriptionMailer";

export const runtime = "nodejs";

type ContactBody = {
  name?: string;
  email?: string;
  organization?: string;
  message?: string;
  website?: string;
};

function asText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(email));
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as ContactBody | null;

  if (!body) {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot field: silently accept to avoid confirming spam filters.
  if (asText(body.website)) {
    return NextResponse.json({ ok: true, message: "Message sent." });
  }

  const name = asText(body.name);
  const email = normalizeEmail(asText(body.email));
  const organization = asText(body.organization);
  const message = asText(body.message);

  if (name.length < 2 || name.length > 120) {
    return NextResponse.json({ ok: false, error: "Please enter a valid name." }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email." }, { status: 400 });
  }
  if (organization.length > 180) {
    return NextResponse.json(
      { ok: false, error: "Organization is too long." },
      { status: 400 }
    );
  }
  if (message.length < 10 || message.length > 4000) {
    return NextResponse.json(
      { ok: false, error: "Please enter a message between 10 and 4000 characters." },
      { status: 400 }
    );
  }

  try {
    const sent = await sendContactEmail({
      name,
      email,
      organization: organization || undefined,
      message,
    });

    if (!sent.ok) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Contact delivery is not configured. Set CONTACT_TO_EMAIL, RESEND_API_KEY, and RESEND_FROM_EMAIL.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Message sent. Thanks for reaching out.",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
