"use client";

import { useEffect, useMemo, useState } from "react";

type SubscriberStatus = "pending" | "confirmed" | "unsubscribed";

type SubscriberItem = {
  email: string;
  status: SubscriberStatus;
  createdAt: string;
  updatedAt: string;
  confirmedAt: string | null;
};

type AdminResponse = {
  ok: boolean;
  error?: string;
  storage?: "postgres" | "file";
  filter?: string;
  summary?: {
    total: number;
    pending: number;
    confirmed: number;
    unsubscribed: number;
  };
  count?: number;
  subscribers?: SubscriberItem[];
};

type NotifyResponse = {
  ok: boolean;
  error?: string;
  message?: string;
  candidates?: number;
  subscribers?: number;
  sent?: number;
  dryRun?: boolean;
  targeted?: boolean;
  targetedIds?: string[];
  failures?: Array<{ email: string; contentId: string; reason: string }>;
};

const SECRET_KEY = "idhub-admin-secret";

function fmtDate(value: string | null) {
  if (!value) return "n/a";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

async function readJsonSafely<T>(res: Response): Promise<T | null> {
  const text = await res.text();
  if (!text.trim()) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

function requestErrorMessage(
  res: Response,
  body: { error?: string } | null,
  fallback: string
) {
  if (body?.error) return body.error;
  if (!res.ok) return `${fallback} (${res.status})`;
  return fallback;
}

export default function SubscriptionsAdminPanel() {
  const [secret, setSecret] = useState("");
  const [status, setStatus] = useState<"all" | SubscriberStatus>("confirmed");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AdminResponse | null>(null);

  const [notifyLoading, setNotifyLoading] = useState(false);
  const [notifyResult, setNotifyResult] = useState<NotifyResponse | null>(null);
  const [notifyError, setNotifyError] = useState<string | null>(null);
  const [mode, setMode] = useState<"new" | "targeted" | "backfill">("targeted");
  const [caseSlug, setCaseSlug] = useState("carrions-disease");
  const [dryRun, setDryRun] = useState(true);

  const hasSecret = secret.trim().length > 0;

  const filteredSubscribers = useMemo(() => data?.subscribers ?? [], [data]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(SECRET_KEY) ?? "";
    if (saved) setSecret(saved);
  }, []);

  async function loadSubscribers() {
    if (!secret.trim()) {
      setError("Enter your admin secret first.");
      return;
    }
    setLoading(true);
    setError(null);
    setNotifyResult(null);
    try {
      const query = status === "all" ? "" : `?status=${status}`;
      const res = await fetch(`/api/subscriptions/admin${query}`, {
        headers: {
          "x-notify-secret": secret.trim(),
        },
        cache: "no-store",
      });
      const body = await readJsonSafely<AdminResponse>(res);
      if (!res.ok || !body?.ok) {
        throw new Error(
          requestErrorMessage(res, body, "Server returned an empty or invalid response")
        );
      }
      setData(body);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(SECRET_KEY, secret.trim());
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load subscribers.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  async function sendNotification() {
    if (!secret.trim()) {
      setNotifyError("Enter your admin secret first.");
      return;
    }
    if (mode === "targeted" && !caseSlug.trim()) {
      setNotifyError("Enter a case slug for targeted send.");
      return;
    }

    setNotifyLoading(true);
    setNotifyError(null);
    setNotifyResult(null);
    try {
      const payload: Record<string, unknown> = { dryRun };
      if (mode === "targeted") payload.caseSlug = caseSlug.trim();
      if (mode === "backfill") payload.backfill = true;

      const res = await fetch("/api/subscriptions/notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-notify-secret": secret.trim(),
        },
        body: JSON.stringify(payload),
      });

      const body = await readJsonSafely<NotifyResponse>(res);
      if (!res.ok || !body?.ok) {
        throw new Error(
          requestErrorMessage(res, body, "Server returned an empty or invalid response")
        );
      }
      setNotifyResult(body);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(SECRET_KEY, secret.trim());
      }
    } catch (e) {
      setNotifyError(e instanceof Error ? e.message : "Failed to send notification.");
    } finally {
      setNotifyLoading(false);
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
            onClick={loadSubscribers}
            disabled={loading || !hasSecret}
            className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Loading..." : "Load Subscribers"}
          </button>
        </div>
        {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
              Filter
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "all" | SubscriberStatus)}
              className="mt-1 rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--foreground)]"
            >
              <option value="all">All</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="unsubscribed">Unsubscribed</option>
            </select>
          </div>
          <button
            type="button"
            onClick={loadSubscribers}
            disabled={loading || !hasSecret}
            className="rounded-lg border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Refresh
          </button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          <Metric label="Total" value={data?.summary?.total ?? 0} />
          <Metric label="Confirmed" value={data?.summary?.confirmed ?? 0} />
          <Metric label="Pending" value={data?.summary?.pending ?? 0} />
          <Metric label="Unsubscribed" value={data?.summary?.unsubscribed ?? 0} />
        </div>

        {data?.storage ? (
          <p
            className={`mt-3 text-sm ${
              data.storage === "postgres" ? "text-green-700" : "text-amber-700"
            }`}
          >
            Storage mode: <strong>{data.storage}</strong>
            {data.storage === "file"
              ? " (file storage can reset on Vercel redeploys)"
              : ""}
          </p>
        ) : null}

        <div className="mt-4 overflow-x-auto rounded-lg border border-[var(--border)] bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-[var(--background)] text-left text-[var(--muted)]">
              <tr>
                <th className="px-3 py-2 font-semibold">Email</th>
                <th className="px-3 py-2 font-semibold">Status</th>
                <th className="px-3 py-2 font-semibold">Created</th>
                <th className="px-3 py-2 font-semibold">Updated</th>
                <th className="px-3 py-2 font-semibold">Confirmed</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubscribers.map((s) => (
                <tr key={`${s.email}-${s.updatedAt}`} className="border-t border-[var(--border)]">
                  <td className="px-3 py-2">{s.email}</td>
                  <td className="px-3 py-2 capitalize">{s.status}</td>
                  <td className="px-3 py-2">{fmtDate(s.createdAt)}</td>
                  <td className="px-3 py-2">{fmtDate(s.updatedAt)}</td>
                  <td className="px-3 py-2">{fmtDate(s.confirmedAt)}</td>
                </tr>
              ))}
              {filteredSubscribers.length === 0 ? (
                <tr>
                  <td className="px-3 py-4 text-[var(--muted)]" colSpan={5}>
                    No subscribers found for this filter.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">Send Notifications</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Trigger notify endpoint from UI. Start with dry run.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <label className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-white p-3 text-sm">
            <input
              type="radio"
              checked={mode === "targeted"}
              onChange={() => setMode("targeted")}
            />
            Targeted case
          </label>
          <label className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-white p-3 text-sm">
            <input type="radio" checked={mode === "new"} onChange={() => setMode("new")} />
            New only
          </label>
          <label className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-white p-3 text-sm">
            <input
              type="radio"
              checked={mode === "backfill"}
              onChange={() => setMode("backfill")}
            />
            Backfill
          </label>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="text"
            value={caseSlug}
            onChange={(e) => setCaseSlug(e.target.value)}
            disabled={mode !== "targeted"}
            placeholder="case slug, e.g. carrions-disease"
            className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--foreground)] disabled:opacity-50"
          />
          <label className="inline-flex items-center gap-2 text-sm text-[var(--foreground)]">
            <input type="checkbox" checked={dryRun} onChange={(e) => setDryRun(e.target.checked)} />
            Dry run
          </label>
          <button
            type="button"
            onClick={sendNotification}
            disabled={notifyLoading || !hasSecret}
            className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {notifyLoading ? "Sending..." : "Run Notify"}
          </button>
        </div>

        {notifyError ? <p className="mt-3 text-sm text-red-700">{notifyError}</p> : null}
        {notifyResult ? (
          <pre className="mt-3 overflow-x-auto rounded-lg border border-[var(--border)] bg-white p-3 text-xs text-[var(--foreground)]">
            {JSON.stringify(notifyResult, null, 2)}
          </pre>
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
