"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ContactState = {
  name: string;
  email: string;
  organization: string;
  message: string;
  website: string; // honeypot
};

const INITIAL_STATE: ContactState = {
  name: "",
  email: "",
  organization: "",
  message: "",
  website: "",
};

export default function ContactForm() {
  const router = useRouter();
  const [form, setForm] = useState<ContactState>(INITIAL_STATE);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  function update<K extends keyof ContactState>(key: K, value: ContactState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const body = (await res.json().catch(() => null)) as
        | { ok?: boolean; message?: string; error?: string }
        | null;
      if (!res.ok || !body?.ok) {
        throw new Error(body?.error ?? "Could not send message.");
      }

      setForm(INITIAL_STATE);
      router.push("/contact/thanks");
    } catch (err) {
      setResult({
        ok: false,
        message: err instanceof Error ? err.message : "Could not send message.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-[var(--foreground)]">Name</span>
          <input
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className="mt-1 w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--foreground)] outline-none ring-[var(--primary)] focus:ring-2"
            maxLength={120}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-[var(--foreground)]">Email</span>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="mt-1 w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--foreground)] outline-none ring-[var(--primary)] focus:ring-2"
            maxLength={254}
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-[var(--foreground)]">
          Feedback, Idea, or Project (optional)
        </span>
        <input
          value={form.organization}
          onChange={(e) => update("organization", e.target.value)}
          className="mt-1 w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--foreground)] outline-none ring-[var(--primary)] focus:ring-2"
          maxLength={180}
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-[var(--foreground)]">Message</span>
        <textarea
          required
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          className="mt-1 min-h-36 w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--foreground)] outline-none ring-[var(--primary)] focus:ring-2"
          maxLength={4000}
        />
      </label>

      {/* Honeypot */}
      <label className="hidden" aria-hidden="true">
        <span>Website</span>
        <input
          value={form.website}
          onChange={(e) => update("website", e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </label>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Sending..." : "Send message"}
        </button>

        {result ? (
          <p className={`text-sm ${result.ok ? "text-green-700" : "text-red-700"}`}>
            {result.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
