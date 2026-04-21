import { NextRequest, NextResponse } from "next/server";

import { collectContentUpdates } from "@/lib/subscriptionContent";
import { buildContentUpdateEmail } from "@/lib/subscriptionMailer";

export const runtime = "nodejs";

function authorized(request: NextRequest) {
  const expected = process.env.SUBSCRIPTIONS_NOTIFY_SECRET;
  if (!expected) return false;
  const header = request.headers.get("x-notify-secret");
  return header === expected;
}

function normalizeTarget(kind: string | null, slug: string | null) {
  if (!kind || !slug) return null;
  if (kind !== "case" && kind !== "blog") return null;
  const trimmed = slug.trim();
  if (!trimmed) return null;
  return `${kind}:${trimmed}`;
}

export async function GET(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized. Pass x-notify-secret header." },
      { status: 401 }
    );
  }

  const targetId = normalizeTarget(
    request.nextUrl.searchParams.get("kind"),
    request.nextUrl.searchParams.get("slug")
  );

  if (!targetId) {
    return NextResponse.json(
      { ok: false, error: "Provide kind=case|blog and a slug query parameter." },
      { status: 400 }
    );
  }

  try {
    const updates = await collectContentUpdates();
    const item = updates.find((update) => update.id === targetId);

    if (!item) {
      return NextResponse.json(
        { ok: false, error: "No matching content found for that slug." },
        { status: 404 }
      );
    }

    const email = buildContentUpdateEmail({
      title: item.title,
      url: item.url,
      kind: item.kind,
      summary: item.summary,
      firstQuestion: item.firstQuestion,
      imageUrl: item.imageUrl,
      unsubscribeToken: "preview-token",
    });

    return NextResponse.json({
      ok: true,
      contentId: item.id,
      title: item.title,
      subject: email.subject,
      html: email.html,
      text: email.text,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected server error.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
