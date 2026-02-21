import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Message Sent | IDHub",
  description: "Thank you for contacting IDHub.",
};

export default function ContactThanksPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center shadow-sm">
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
          Thank you for your message
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-[var(--foreground)]/85">
          Your feedback was sent successfully. I appreciate you taking the time to reach out.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white"
          >
            Back to Main Page
          </Link>
          <Link
            href="/contact"
            className="rounded-lg border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--foreground)]"
          >
            Send Another Message
          </Link>
        </div>
      </section>
    </main>
  );
}
