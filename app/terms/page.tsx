import type { Metadata } from "next";

import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms of use for InfectiousDiseaseHub.",
  alternates: { canonical: "https://infectiousdiseasehub.com/terms" },
  openGraph: {
    type: "website",
    url: "https://infectiousdiseasehub.com/terms",
    siteName: "InfectiousDiseaseHub",
    title: "Terms",
    description: "Terms of use for InfectiousDiseaseHub.",
  },
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
          Terms of Use
        </h1>
        <p className="mt-3 text-[var(--foreground)]/85">
          By using IDHub, you agree to the following educational-use terms.
        </p>
      </header>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm space-y-4 text-[var(--foreground)]/90">
        <p>
          IDHub content is provided for medical education and training support only. It does not
          replace clinical judgment, institutional guidelines, or specialist consultation.
        </p>
        <p>
          You are responsible for all diagnostic and treatment decisions made in real clinical care.
        </p>
        <p>
          We may update content and tools over time as educational materials evolve.
        </p>
      </section>

      <SiteFooter />
    </main>
  );
}
