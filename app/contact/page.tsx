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
    <section className="mx-auto max-w-6xl px-2 py-10 sm:px-4">
      <header className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.95fr)] lg:items-start">
        <div className="idhub-panel-strong rounded-[2rem] px-6 py-8 sm:px-8">
          <p className="idhub-kicker">Contact</p>
          <h1 className="mt-3 text-5xl font-semibold text-[var(--foreground)] sm:text-6xl">
            Let&apos;s build something thoughtful
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--muted)] sm:text-lg">
            Share an educational idea, a clinical case concept, feedback on the platform, or a
            collaboration opportunity. IDHub is meant to grow in conversation with the people using it.
          </p>

          <div className="mt-7">
            <Link href="/" className="idhub-button-secondary px-5 py-3 text-sm font-semibold">
              Back to Home
            </Link>
          </div>
        </div>

        <aside className="idhub-panel rounded-[1.75rem] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted-soft)]">
            Good uses for this form
          </p>
          <ul className="mt-4 space-y-4 text-sm leading-7 text-[var(--muted)]">
            <li>Case ideas and teaching collaborations.</li>
            <li>Feedback on tools, design, or educational content.</li>
            <li>Research or project partnerships.</li>
          </ul>
        </aside>
      </header>

      <section className="mt-10">
        <div className="idhub-panel-strong rounded-[1.9rem] p-6 sm:p-7">
          <p className="idhub-kicker">Reach Out</p>
          <h2 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
            Send a message
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            Replies will go to the email address you include in the form.
          </p>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>
      </section>

      <SiteFooter />
    </section>
  );
}
