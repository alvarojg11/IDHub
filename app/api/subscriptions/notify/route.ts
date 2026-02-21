import { NextRequest, NextResponse } from "next/server";

import { collectContentUpdates } from "@/lib/subscriptionContent";
import { emailProviderConfigured, sendContentUpdateEmail } from "@/lib/subscriptionMailer";
import {
  getConfirmedSubscribers,
  getNotificationState,
  markDelivery,
  markKnownContentIds,
} from "@/lib/subscriptionsStore";

export const runtime = "nodejs";

function authorized(request: NextRequest, bodySecret?: string) {
  const expected = process.env.SUBSCRIPTIONS_NOTIFY_SECRET;
  if (!expected) return false;
  const header = request.headers.get("x-notify-secret");
  return header === expected || bodySecret === expected;
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as
    | { secret?: string; backfill?: boolean; dryRun?: boolean }
    | null;

  if (!authorized(request, body?.secret)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized. Set SUBSCRIPTIONS_NOTIFY_SECRET and pass it in request." },
      { status: 401 }
    );
  }

  const updates = await collectContentUpdates();
  const { knownContentIds, sentByContentId } = await getNotificationState();
  const confirmed = await getConfirmedSubscribers();
  const backfill = Boolean(body?.backfill);
  const dryRun = Boolean(body?.dryRun);

  if (updates.length === 0) {
    return NextResponse.json({ ok: true, message: "No content available to process.", sent: 0 });
  }

  if (knownContentIds.size === 0 && !backfill) {
    await markKnownContentIds(updates.map((u) => u.id));
    return NextResponse.json({
      ok: true,
      message:
        "Baseline established. Existing content marked as known; future notify runs will send only new items.",
      knownCount: updates.length,
      sent: 0,
    });
  }

  const candidates = updates.filter((u) => backfill || !knownContentIds.has(u.id));
  if (candidates.length === 0) {
    return NextResponse.json({ ok: true, message: "No new content to send.", sent: 0 });
  }

  if (!emailProviderConfigured() && !dryRun) {
    return NextResponse.json(
      { ok: false, error: "Email provider not configured. Set RESEND_API_KEY and RESEND_FROM_EMAIL." },
      { status: 400 }
    );
  }

  let sent = 0;
  const failures: Array<{ email: string; contentId: string; reason: string }> = [];

  for (const item of candidates) {
    for (const subscriber of confirmed) {
      const alreadySent = (sentByContentId[item.id] ?? []).includes(subscriber.email);
      if (alreadySent) continue;

      if (dryRun) {
        sent += 1;
        continue;
      }

      try {
        const result = await sendContentUpdateEmail({
          to: subscriber.email,
          title: item.title,
          url: item.url,
          kind: item.kind,
          summary: item.summary,
          firstQuestion: item.firstQuestion,
          unsubscribeToken: subscriber.unsubscribeToken,
        });
        if (!result.ok) {
          failures.push({
            email: subscriber.email,
            contentId: item.id,
            reason: result.reason,
          });
          continue;
        }
        await markDelivery(item.id, subscriber.email);
        sent += 1;
      } catch (err) {
        failures.push({
          email: subscriber.email,
          contentId: item.id,
          reason: err instanceof Error ? err.message : "Unknown send error",
        });
      }
    }
  }

  await markKnownContentIds(updates.map((u) => u.id));

  return NextResponse.json({
    ok: true,
    candidates: candidates.length,
    subscribers: confirmed.length,
    sent,
    dryRun,
    failures,
  });
}
