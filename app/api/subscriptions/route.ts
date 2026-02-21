import { NextRequest, NextResponse } from "next/server";

import {
  isValidEmail,
  normalizeEmail,
  subscribeEmail,
} from "@/lib/subscriptionsStore";
import { sendConfirmationEmail } from "@/lib/subscriptionMailer";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as { email?: string } | null;
  const email = normalizeEmail(body?.email ?? "");

  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: "Please provide a valid email." }, { status: 400 });
  }

  try {
    const result = await subscribeEmail(email);

    if (result.status === "already_confirmed") {
      return NextResponse.json({
        ok: true,
        status: "already_confirmed",
        message: "This email is already subscribed.",
      });
    }

    const sendResult = await sendConfirmationEmail({
      to: email,
      confirmToken: result.confirmToken as string,
      unsubscribeToken: result.unsubscribeToken,
    });

    return NextResponse.json({
      ok: true,
      status: result.status,
      message:
        sendResult.ok
          ? "Check your email to confirm your subscription."
          : "Subscription saved. Email delivery is not configured yet.",
      confirmUrl:
        process.env.NODE_ENV !== "production" ? sendResult.confirmUrl : undefined,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
