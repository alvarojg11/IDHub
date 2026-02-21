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
const RESEND_MIN_INTERVAL_MS = 550;
const MAX_RATE_LIMIT_RETRIES = 4;

function authorized(request: NextRequest, bodySecret?: string) {
  const expected = process.env.SUBSCRIPTIONS_NOTIFY_SECRET;
  if (!expected) return false;
  const header = request.headers.get("x-notify-secret");
  return header === expected || bodySecret === expected;
}

function normalizeList(input?: string | string[]) {
  if (!input) return [];
  const arr = Array.isArray(input) ? input : [input];
  return arr.map((v) => v.trim()).filter(Boolean);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRateLimitedError(message: string) {
  return message.includes("(429)") || /too many requests/i.test(message);
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as
    | {
        secret?: string;
        backfill?: boolean;
        dryRun?: boolean;
        contentId?: string;
        contentIds?: string[];
        caseSlug?: string;
        caseSlugs?: string[];
      }
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
  const explicitIds = new Set<string>([
    ...normalizeList(body?.contentId),
    ...normalizeList(body?.contentIds),
    ...normalizeList(body?.caseSlug).map((slug) => `case:${slug}`),
    ...normalizeList(body?.caseSlugs).map((slug) => `case:${slug}`),
  ]);
  const targeted = explicitIds.size > 0;

  if (updates.length === 0) {
    return NextResponse.json({ ok: true, message: "No content available to process.", sent: 0 });
  }

  if (knownContentIds.size === 0 && !backfill && !targeted) {
    await markKnownContentIds(updates.map((u) => u.id));
    return NextResponse.json({
      ok: true,
      message:
        "Baseline established. Existing content marked as known; future notify runs will send only new items.",
      knownCount: updates.length,
      sent: 0,
    });
  }

  const candidates = updates.filter((u) => {
    if (targeted) return explicitIds.has(u.id);
    return backfill || !knownContentIds.has(u.id);
  });

  if (targeted && candidates.length === 0) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "No matching content found for the requested target filter. Use contentId (e.g., case:carrions-disease) or caseSlug (e.g., carrions-disease).",
      },
      { status: 400 }
    );
  }

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
  let nextSendAt = 0;

  for (const item of candidates) {
    for (const subscriber of confirmed) {
      const alreadySent = (sentByContentId[item.id] ?? []).includes(subscriber.email);
      if (alreadySent) continue;

      if (dryRun) {
        sent += 1;
        continue;
      }

      let delivered = false;
      let lastError = "Unknown send error";

      for (let attempt = 0; attempt <= MAX_RATE_LIMIT_RETRIES; attempt += 1) {
        const now = Date.now();
        if (now < nextSendAt) {
          await sleep(nextSendAt - now);
        }

        try {
          const result = await sendContentUpdateEmail({
            to: subscriber.email,
            title: item.title,
            url: item.url,
            kind: item.kind,
            summary: item.summary,
            firstQuestion: item.firstQuestion,
            imageUrl: item.imageUrl,
            unsubscribeToken: subscriber.unsubscribeToken,
          });

          // Pace requests under provider limit (~2 req/sec)
          nextSendAt = Date.now() + RESEND_MIN_INTERVAL_MS;

          if (!result.ok) {
            lastError = result.reason;
            break;
          }

          await markDelivery(item.id, subscriber.email);
          sent += 1;
          delivered = true;
          break;
        } catch (err) {
          const message = err instanceof Error ? err.message : "Unknown send error";
          lastError = message;

          if (isRateLimitedError(message) && attempt < MAX_RATE_LIMIT_RETRIES) {
            const backoffMs = Math.max(
              RESEND_MIN_INTERVAL_MS,
              1000 * Math.pow(2, attempt)
            );
            nextSendAt = Date.now() + backoffMs;
            continue;
          }
          break;
        }
      }

      if (!delivered) {
        failures.push({
          email: subscriber.email,
          contentId: item.id,
          reason: lastError,
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
    targeted,
    targetedIds: targeted ? Array.from(explicitIds) : [],
    failures,
  });
}
