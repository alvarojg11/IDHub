import { NextRequest, NextResponse } from "next/server";

import {
  confirmSubscriptionByToken,
  isValidEmail,
  normalizeEmail,
  subscribeEmail,
} from "@/lib/subscriptionsStore";
import { sendWelcomeEmail } from "@/lib/subscriptionMailer";

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

    const activation = await confirmSubscriptionByToken(result.confirmToken as string);
    if (!activation.ok || !activation.email || !activation.unsubscribeToken) {
      return NextResponse.json(
        {
          ok: false,
          error: "Subscription was saved but activation failed. Please try again.",
        },
        { status: 500 }
      );
    }

    const welcomeResult = await sendWelcomeEmail({
      to: activation.email,
      unsubscribeToken: activation.unsubscribeToken,
    });

    return NextResponse.json({
      ok: true,
      status: "subscribed",
      message:
        welcomeResult.ok
          ? "Subscribed successfully. Welcome email sent."
          : "Subscribed successfully, but welcome email delivery is not configured yet.",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
