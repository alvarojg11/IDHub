"use client";

import { FormEvent, useState } from "react";

type Props = {
  compact?: boolean;
};

async function readJsonSafely<T>(res: Response): Promise<T | null> {
  const text = await res.text();
  if (!text.trim()) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export default function SubscribeForm({ compact = false }: Props) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<null | { kind: "ok" | "error"; text: string; confirmUrl?: string }>(
    null
  );

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;
    setBusy(true);
    setStatus(null);

    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await readJsonSafely<{
        ok: boolean;
        message?: string;
        error?: string;
        confirmUrl?: string;
      }>(res);

      if (!res.ok || !data?.ok) {
        setStatus({
          kind: "error",
          text: data?.error ?? `Subscription failed (${res.status}).`,
        });
        return;
      }

      setStatus({
        kind: "ok",
        text: data.message ?? "Subscription request received.",
        confirmUrl: data.confirmUrl,
      });
      setEmail("");
    } catch {
      setStatus({ kind: "error", text: "Network error. Please try again." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className={compact ? "space-y-2" : "space-y-3"}>
      <div className={compact ? "flex flex-col gap-2 sm:flex-row" : "flex flex-col gap-3 sm:flex-row"}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="w-full rounded-md border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--foreground)] shadow-sm outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
        />
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center justify-center rounded-md border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--card-hover)] disabled:opacity-60"
        >
          {busy ? "Submitting..." : "Subscribe"}
        </button>
      </div>

      {status ? (
        <p className={`text-xs ${status.kind === "ok" ? "text-green-700" : "text-red-700"}`}>
          {status.text}
          {status.confirmUrl ? (
            <>
              {" "}
              <a href={status.confirmUrl} className="underline">
                Confirm now
              </a>
            </>
          ) : null}
        </p>
      ) : null}
    </form>
  );
}
