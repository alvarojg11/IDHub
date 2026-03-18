"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ContactState = {
  name: string;
  email: string;
  organization: string;
  message: string;
  website: string; // honeypot
  context: string;
};

const INITIAL_STATE: ContactState = {
  name: "",
  email: "",
  organization: "",
  message: "",
  website: "",
  context: "contact",
};

type ContactFormProps = {
  context?: "contact" | "research";
  organizationLabel?: string;
  messageLabel?: string;
  submitLabel?: string;
  successRedirect?: string;
};

export default function ContactForm({
  context = "contact",
  organizationLabel = "Feedback, Idea, or Project (optional)",
  messageLabel = "Message",
  submitLabel = "Send message",
  successRedirect = "/contact/thanks",
}: ContactFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<ContactState>({ ...INITIAL_STATE, context });
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

      setForm({ ...INITIAL_STATE, context });
      router.push(successRedirect);
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
            className="idhub-input mt-2 text-sm"
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
            className="idhub-input mt-2 text-sm"
            maxLength={254}
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-[var(--foreground)]">
          {organizationLabel}
        </span>
        <input
          value={form.organization}
          onChange={(e) => update("organization", e.target.value)}
          className="idhub-input mt-2 text-sm"
          maxLength={180}
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-[var(--foreground)]">{messageLabel}</span>
        <textarea
          required
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          className="idhub-textarea mt-2 text-sm"
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
          className="idhub-button-primary px-5 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Sending..." : submitLabel}
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
