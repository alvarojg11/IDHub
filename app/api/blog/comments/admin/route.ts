import { NextRequest, NextResponse } from "next/server";

import {
  commentsStorageMode,
  getCommentsForAdmin,
  isValidBlogSlug,
  setCommentApproved,
  type BlogCommentRecord,
} from "@/lib/blogCommentsStore";

export const runtime = "nodejs";

function authorized(request: NextRequest, bodySecret?: string) {
  const expected = process.env.SUBSCRIPTIONS_NOTIFY_SECRET;
  if (!expected) return false;
  const header = request.headers.get("x-notify-secret");
  return header === expected || bodySecret === expected;
}

function parseApprovedFilter(
  value: string | null
): { ok: true; value: boolean | undefined } | { ok: false } {
  if (!value || value === "all") return { ok: true, value: undefined };
  if (value === "approved" || value === "true") return { ok: true, value: true };
  if (value === "pending" || value === "false") return { ok: true, value: false };
  return { ok: false };
}

function summarize(items: BlogCommentRecord[]) {
  const summary = {
    total: items.length,
    approved: 0,
    pending: 0,
  };
  for (const item of items) {
    if (item.approved) summary.approved += 1;
    else summary.pending += 1;
  }
  return summary;
}

export async function GET(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized. Pass x-notify-secret header." },
      { status: 401 }
    );
  }

  const approvedRaw = request.nextUrl.searchParams.get("approved");
  const approvedFilter = parseApprovedFilter(approvedRaw);
  if (!approvedFilter.ok) {
    return NextResponse.json(
      { ok: false, error: "Invalid approved filter. Use all, approved, or pending." },
      { status: 400 }
    );
  }

  const slugRaw = (request.nextUrl.searchParams.get("slug") ?? "").trim().toLowerCase();
  if (slugRaw && !isValidBlogSlug(slugRaw)) {
    return NextResponse.json({ ok: false, error: "Invalid slug filter." }, { status: 400 });
  }

  try {
    const [all, filtered] = await Promise.all([
      getCommentsForAdmin(),
      getCommentsForAdmin({
        slug: slugRaw || undefined,
        approved: approvedFilter.value,
      }),
    ]);

    return NextResponse.json({
      ok: true,
      storage: commentsStorageMode(),
      filter: {
        approved: approvedRaw ?? "all",
        slug: slugRaw || "",
      },
      summary: summarize(all),
      count: filtered.length,
      comments: filtered,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected server error.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as
    | { id?: string; approved?: boolean; secret?: string }
    | null;

  if (!authorized(request, body?.secret)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized. Pass x-notify-secret header." },
      { status: 401 }
    );
  }
  if (!body || typeof body.id !== "string" || !body.id.trim()) {
    return NextResponse.json({ ok: false, error: "Comment id is required." }, { status: 400 });
  }
  if (typeof body.approved !== "boolean") {
    return NextResponse.json(
      { ok: false, error: "Approved value must be true or false." },
      { status: 400 }
    );
  }

  try {
    const updated = await setCommentApproved(body.id.trim(), body.approved);
    if (!updated) {
      return NextResponse.json({ ok: false, error: "Comment not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, id: body.id.trim(), approved: body.approved });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected server error.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
