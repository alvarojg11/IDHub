"use client";

import { useEffect, useMemo, useState } from "react";

type CommentItem = {
  id: string;
  slug: string;
  name: string;
  comment: string;
  approved: boolean;
  createdAt: string;
};

type AdminResponse = {
  ok: boolean;
  error?: string;
  storage?: "postgres" | "file";
  filter?: {
    approved: string;
    slug: string;
  };
  summary?: {
    total: number;
    approved: number;
    pending: number;
  };
  count?: number;
  comments?: CommentItem[];
};

type PatchResponse = {
  ok: boolean;
  error?: string;
};

const SECRET_KEY = "idhub-comments-admin-secret";

function fmtDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

function shortComment(value: string, max = 180) {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1).trim()}...`;
}

export default function CommentsAdminPanel() {
  const [secret, setSecret] = useState("");
  const [approvedFilter, setApprovedFilter] = useState<"all" | "pending" | "approved">("pending");
  const [slugFilter, setSlugFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AdminResponse | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  const hasSecret = secret.trim().length > 0;
  const comments = useMemo(() => data?.comments ?? [], [data]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(SECRET_KEY) ?? "";
    if (saved) setSecret(saved);
  }, []);

  async function loadComments() {
    if (!secret.trim()) {
      setError("Enter your admin secret first.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("approved", approvedFilter);
      if (slugFilter.trim()) params.set("slug", slugFilter.trim());
      const res = await fetch(`/api/blog/comments/admin?${params.toString()}`, {
        headers: {
          "x-notify-secret": secret.trim(),
        },
        cache: "no-store",
      });
      const body = (await res.json()) as AdminResponse;
      if (!res.ok || !body.ok) {
        throw new Error(body.error ?? `Request failed (${res.status})`);
      }
      setData(body);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(SECRET_KEY, secret.trim());
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load comments.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  async function toggleApproval(item: CommentItem, nextApproved: boolean) {
    if (!secret.trim()) {
      setError("Enter your admin secret first.");
      return;
    }
    setToggling(item.id);
    setError(null);
    try {
      const res = await fetch("/api/blog/comments/admin", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-notify-secret": secret.trim(),
        },
        body: JSON.stringify({
          id: item.id,
          approved: nextApproved,
        }),
      });
      const body = (await res.json()) as PatchResponse;
      if (!res.ok || !body.ok) {
        throw new Error(body.error ?? `Request failed (${res.status})`);
      }

      setData((prev) => {
        if (!prev?.comments) return prev;
        return {
          ...prev,
          comments: prev.comments.map((c) =>
            c.id === item.id ? { ...c, approved: nextApproved } : c
          ),
        };
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update comment status.");
    } finally {
      setToggling(null);
    }
  }

  return (
    <section className="space-y-6">
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">Access</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Enter the same value used for <code>SUBSCRIPTIONS_NOTIFY_SECRET</code>.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="SUBSCRIPTIONS_NOTIFY_SECRET"
            className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--foreground)] outline-none ring-[var(--primary)] focus:ring-2"
          />
          <button
            type="button"
            onClick={loadComments}
            disabled={loading || !hasSecret}
            className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Loading..." : "Load Comments"}
          </button>
        </div>
        {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
              Status
            </label>
            <select
              value={approvedFilter}
              onChange={(e) => setApprovedFilter(e.target.value as "all" | "pending" | "approved")}
              className="mt-1 rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--foreground)]"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
              Blog slug
            </label>
            <input
              type="text"
              value={slugFilter}
              onChange={(e) => setSlugFilter(e.target.value)}
              placeholder="optional"
              className="mt-1 rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--foreground)]"
            />
          </div>

          <button
            type="button"
            onClick={loadComments}
            disabled={loading || !hasSecret}
            className="rounded-lg border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Refresh
          </button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Metric label="Total" value={data?.summary?.total ?? 0} />
          <Metric label="Approved" value={data?.summary?.approved ?? 0} />
          <Metric label="Pending" value={data?.summary?.pending ?? 0} />
        </div>

        <div className="mt-4 overflow-x-auto rounded-lg border border-[var(--border)] bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-[var(--background)] text-left text-[var(--muted)]">
              <tr>
                <th className="px-3 py-2 font-semibold">Created</th>
                <th className="px-3 py-2 font-semibold">Post</th>
                <th className="px-3 py-2 font-semibold">Name</th>
                <th className="px-3 py-2 font-semibold">Comment</th>
                <th className="px-3 py-2 font-semibold">Status</th>
                <th className="px-3 py-2 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {comments.map((item) => (
                <tr key={item.id} className="border-t border-[var(--border)] align-top">
                  <td className="px-3 py-2">{fmtDate(item.createdAt)}</td>
                  <td className="px-3 py-2">
                    <code>{item.slug}</code>
                  </td>
                  <td className="px-3 py-2">{item.name}</td>
                  <td className="px-3 py-2">{shortComment(item.comment)}</td>
                  <td className="px-3 py-2">{item.approved ? "Approved" : "Pending"}</td>
                  <td className="px-3 py-2">
                    {item.approved ? (
                      <button
                        type="button"
                        onClick={() => toggleApproval(item, false)}
                        disabled={toggling === item.id}
                        className="rounded-md border border-[var(--border)] bg-white px-3 py-1 text-xs font-semibold text-[var(--foreground)] disabled:opacity-60"
                      >
                        Hide
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => toggleApproval(item, true)}
                        disabled={toggling === item.id}
                        className="rounded-md bg-[var(--primary)] px-3 py-1 text-xs font-semibold text-white disabled:opacity-60"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {comments.length === 0 ? (
                <tr>
                  <td className="px-3 py-4 text-[var(--muted)]" colSpan={6}>
                    No comments found for this filter.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        {data?.storage ? (
          <p className="mt-3 text-xs text-[var(--muted)]">
            Storage mode: <code>{data.storage}</code>
          </p>
        ) : null}
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-white p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">{label}</p>
      <p className="mt-1 text-2xl font-bold text-[var(--foreground)]">{value}</p>
    </div>
  );
}
