import { NextRequest, NextResponse } from "next/server";

import { collectContentUpdates } from "@/lib/subscriptionContent";
import { submitIndexNow } from "@/lib/indexNow";

export const runtime = "nodejs";

function authorized(request: NextRequest, bodySecret?: string) {
  const expected = process.env.SUBSCRIPTIONS_NOTIFY_SECRET;
  if (!expected) return false;
  const header = request.headers.get("x-notify-secret");
  return header === expected || bodySecret === expected;
}

function normalizeList(input?: string | string[]) {
  if (!input) return [];
  const arr = Array.isArray(input) ? input : [input];
  return arr.map((value) => value.trim()).filter(Boolean);
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as
    | {
        secret?: string;
        url?: string;
        urls?: string[];
        contentId?: string;
        contentIds?: string[];
        caseSlug?: string;
        caseSlugs?: string[];
        blogSlug?: string;
        blogSlugs?: string[];
      }
    | null;

  if (!authorized(request, body?.secret)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized. Set SUBSCRIPTIONS_NOTIFY_SECRET and pass it in request." },
      { status: 401 }
    );
  }

  const explicitUrls = [...normalizeList(body?.url), ...normalizeList(body?.urls)];
  const explicitIds = new Set<string>([
    ...normalizeList(body?.contentId),
    ...normalizeList(body?.contentIds),
    ...normalizeList(body?.caseSlug).map((slug) => `case:${slug}`),
    ...normalizeList(body?.caseSlugs).map((slug) => `case:${slug}`),
    ...normalizeList(body?.blogSlug).map((slug) => `blog:${slug}`),
    ...normalizeList(body?.blogSlugs).map((slug) => `blog:${slug}`),
  ]);

  try {
    let urls = explicitUrls;

    if (explicitIds.size > 0) {
      const updates = await collectContentUpdates();
      const matchedUrls = updates
        .filter((item) => explicitIds.has(item.id))
        .map((item) => item.url);

      if (matchedUrls.length === 0 && explicitUrls.length === 0) {
        return NextResponse.json(
          {
            ok: false,
            error:
              "No matching content found for the requested target filter. Use contentId, caseSlug, blogSlug, url, or urls.",
          },
          { status: 400 }
        );
      }

      urls = [...urls, ...matchedUrls];
    }

    if (urls.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Provide at least one url, contentId, caseSlug, or blogSlug.",
        },
        { status: 400 }
      );
    }

    const result = await submitIndexNow(urls);
    const requested = [...new Set(urls)];

    if (!result.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: result.reason,
          requested,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ...result,
      requested,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected server error.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
