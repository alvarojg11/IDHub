import { NextRequest, NextResponse } from "next/server";

import {
  getSubscribers,
  type SubscriberListItem,
  type SubscriberStatus,
} from "@/lib/subscriptionsStore";

export const runtime = "nodejs";

function authorized(request: NextRequest) {
  const expected = process.env.SUBSCRIPTIONS_NOTIFY_SECRET;
  if (!expected) return false;
  const header = request.headers.get("x-notify-secret");
  return header === expected;
}

function parseStatus(value: string | null): SubscriberStatus | undefined {
  if (!value) return undefined;
  if (value === "pending" || value === "confirmed" || value === "unsubscribed") {
    return value;
  }
  return undefined;
}

function summarize(items: SubscriberListItem[]) {
  const totals = {
    total: items.length,
    pending: 0,
    confirmed: 0,
    unsubscribed: 0,
  };
  for (const item of items) {
    totals[item.status] += 1;
  }
  return totals;
}

export async function GET(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized. Pass x-notify-secret header." },
      { status: 401 }
    );
  }

  const status = parseStatus(request.nextUrl.searchParams.get("status"));
  const statusRaw = request.nextUrl.searchParams.get("status");
  if (statusRaw && !status) {
    return NextResponse.json(
      {
        ok: false,
        error: "Invalid status filter. Use pending, confirmed, or unsubscribed.",
      },
      { status: 400 }
    );
  }

  const all = await getSubscribers();
  const filtered = status ? all.filter((s) => s.status === status) : all;

  return NextResponse.json({
    ok: true,
    filter: status ?? "all",
    summary: summarize(all),
    count: filtered.length,
    subscribers: filtered,
  });
}
