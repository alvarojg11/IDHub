"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

type CommentItem = {
  id: string;
  slug: string;
  name: string;
  comment: string;
  approved: boolean;
  createdAt: string;
};

type CommentsResponse = {
  ok: boolean;
  error?: string;
  comments?: CommentItem[];
};

function fmtDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

export default function BlogComments() {
  const pathname = usePathname();
  const slug = useMemo(() => {
    const parts = pathname.split("/").filter(Boolean);
    if (parts[0] !== "blog" || !parts[1]) return "";
    return parts[1].toLowerCase();
  }, [pathname]);

  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [website, setWebsite] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ ok: boolean; message: string } | null>(null);

  async function loadComments() {
    if (!slug) return;
    setLoading(true);
    setLoadError(null);
    try {
      const res = await fetch(`/api/blog/comments?slug=${encodeURIComponent(slug)}`, {
        cache: "no-store",
      });
      const body = (await res.json()) as CommentsResponse;
      if (!res.ok || !body.ok) {
        throw new Error(body.error ?? `Request failed (${res.status})`);
      }
      setComments(body.comments ?? []);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Could not load comments.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!slug) return;
    setSubmitting(true);
    setSubmitResult(null);
    try {
      const res = await fetch("/api/blog/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          name,
          comment,
          website, // honeypot
        }),
      });
      const body = (await res.json()) as { ok?: boolean; error?: string; message?: string };
      if (!res.ok || !body.ok) {
        throw new Error(body.error ?? "Unable to submit comment.");
      }
      setSubmitResult({
        ok: true,
        message: body.message ?? "Comment submitted.",
      });
      setName("");
      setComment("");
      setWebsite("");
      await loadComments();
    } catch (err) {
      setSubmitResult({
        ok: false,
        message: err instanceof Error ? err.message : "Unable to submit comment.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (!slug) return null;

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-6">
      <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Comments</h2>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Share your thoughts. Comments are moderated before they appear publicly.
      </p>

      <form onSubmit={onSubmit} className="mt-5 space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-[var(--foreground)]">Name</span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
              className="mt-1 w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--foreground)] outline-none ring-[var(--primary)] focus:ring-2"
            />
          </label>

          <label className="hidden" aria-hidden="true">
            <span>Website</span>
            <input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-[var(--foreground)]">Comment</span>
          <textarea
            required
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={3000}
            className="mt-1 min-h-28 w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--foreground)] outline-none ring-[var(--primary)] focus:ring-2"
          />
        </label>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit comment"}
          </button>
          {submitResult ? (
            <p className={`text-sm ${submitResult.ok ? "text-green-700" : "text-red-700"}`}>
              {submitResult.message}
            </p>
          ) : null}
        </div>
      </form>

      <div className="mt-7 space-y-3">
        {loading ? <p className="text-sm text-[var(--muted)]">Loading comments...</p> : null}
        {loadError ? <p className="text-sm text-red-700">{loadError}</p> : null}

        {!loading && !loadError && comments.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">No comments yet.</p>
        ) : null}

        {!loading && !loadError
          ? comments.map((item) => (
              <article
                key={item.id}
                className="rounded-xl border border-[var(--border)] bg-white p-4 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-[var(--foreground)]">{item.name}</p>
                  <p className="text-xs text-[var(--muted)]">{fmtDate(item.createdAt)}</p>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[var(--foreground)]/90">
                  {item.comment}
                </p>
              </article>
            ))
          : null}
      </div>
    </section>
  );
}
