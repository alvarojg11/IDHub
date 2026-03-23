import type { Metadata } from "next";

import SubscribeForm from "@/components/SubscribeForm";

const BASE_URL = "https://infectiousdiseasehub.com";

export const metadata: Metadata = {
  title: "Subscribe",
  description:
    "Subscribe to IDHub for email updates on new Infectious Diseases cases, teaching essays, and clinical tools.",
  alternates: { canonical: `${BASE_URL}/subscribe` },
  openGraph: {
    type: "website",
    url: `${BASE_URL}/subscribe`,
    siteName: "InfectiousDiseaseHub",
    title: "Subscribe",
    description:
      "Get email updates on new Infectious Diseases cases, teaching essays, and clinical tools.",
  },
  twitter: {
    card: "summary",
    title: "Subscribe",
    description:
      "Get email updates on new Infectious Diseases cases, teaching essays, and clinical tools.",
  },
};

export default function SubscribePage() {
  return (
    <section className="mx-auto max-w-4xl px-2 py-10 sm:px-4">
      <div className="idhub-panel-strong rounded-[2rem] px-6 py-8 sm:px-8">
        <p className="idhub-kicker">Subscribe</p>
        <h1 className="mt-3 text-5xl font-semibold text-[var(--foreground)] sm:text-6xl">
          Get IDHub updates
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">
          Receive an email when a new case, essay, or major platform update is published on IDHub.
        </p>

        <section className="mt-8 rounded-[1.6rem] border border-[var(--border)] bg-white/88 p-6 shadow-[var(--shadow-soft)]">
          <h2 className="text-2xl font-semibold text-[var(--foreground)]">Email updates</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            Subscriptions are activated immediately, and you can unsubscribe any time with one click.
          </p>
          <div className="mt-5">
            <SubscribeForm />
          </div>
        </section>
      </div>
    </section>
  );
}
