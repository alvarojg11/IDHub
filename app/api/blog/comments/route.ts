import { NextRequest, NextResponse } from "next/server";

import {
  addBlogComment,
  commentsStorageMode,
  getApprovedCommentsBySlug,
  isValidBlogSlug,
} from "@/lib/blogCommentsStore";

export const runtime = "nodejs";

type CreateCommentBody = {
  slug?: string;
  name?: string;
  comment?: string;
  website?: string;
};

function asText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeSlug(slug: string) {
  return slug.trim().toLowerCase();
}

export async function GET(request: NextRequest) {
  const slug = normalizeSlug(request.nextUrl.searchParams.get("slug") ?? "");
  if (!isValidBlogSlug(slug)) {
    return NextResponse.json(
      { ok: false, error: "Invalid or missing blog slug." },
      { status: 400 }
    );
  }

  const comments = await getApprovedCommentsBySlug(slug);
  return NextResponse.json({
    ok: true,
    storage: commentsStorageMode(),
    slug,
    count: comments.length,
    comments,
  });
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as CreateCommentBody | null;
  if (!body) {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot field: silently accept.
  if (asText(body.website)) {
    return NextResponse.json({
      ok: true,
      pendingModeration: true,
      message: "Comment submitted and awaiting moderation.",
    });
  }

  const slug = normalizeSlug(asText(body.slug));
  const name = asText(body.name);
  const comment = asText(body.comment);

  if (!isValidBlogSlug(slug)) {
    return NextResponse.json(
      { ok: false, error: "Invalid blog slug." },
      { status: 400 }
    );
  }
  if (name.length < 2 || name.length > 80) {
    return NextResponse.json(
      { ok: false, error: "Please enter a name between 2 and 80 characters." },
      { status: 400 }
    );
  }
  if (comment.length < 3 || comment.length > 3000) {
    return NextResponse.json(
      { ok: false, error: "Comment must be between 3 and 3000 characters." },
      { status: 400 }
    );
  }

  try {
    const created = await addBlogComment({ slug, name, comment });
    return NextResponse.json({
      ok: true,
      pendingModeration: !created.approved,
      message: created.approved
        ? "Comment posted."
        : "Comment submitted and awaiting moderation.",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
