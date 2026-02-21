import Link from "next/link";
import type { Metadata } from "next";

import ContactForm from "@/components/ContactForm";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Contact | IDHub",
  description: "Contact IDHub for feedback, ideas, and collaboration.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-[var(--foreground)]">Contact</h1>
        <p className="mt-3 text-[var(--foreground)]/85">
          Have feedback, an idea for a case, or interest in collaborating? Send a message below.
        </p>
        <div className="mt-5">
          <Link
            href="/"
            className="inline-flex rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm font-semibold text-[var(--foreground)]"
          >
            Back to Main Page
          </Link>
        </div>
      </header>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">Reach out</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Replies will go to the email address you include in the form.
        </p>
        <div className="mt-5">
          <ContactForm />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
