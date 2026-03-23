import type { Metadata } from "next";

import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy information for InfectiousDiseaseHub.",
  alternates: { canonical: "https://infectiousdiseasehub.com/privacy" },
  openGraph: {
    type: "website",
    url: "https://infectiousdiseasehub.com/privacy",
    siteName: "InfectiousDiseaseHub",
    title: "Privacy",
    description: "Privacy information for InfectiousDiseaseHub.",
  },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-[var(--foreground)]">Privacy</h1>
        <p className="mt-3 text-[var(--foreground)]/85">
          This website provides educational clinical reasoning tools for Infectious Diseases.
        </p>
      </header>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm space-y-4 text-[var(--foreground)]/90">
        <p>No personal health data is stored or processed by IDHub.</p>
        <p>
          If you submit contact details through forms (for example, name or email), that information
          is used only to respond to your request and operate site communications.
        </p>
        <p>
          This site is for educational purposes and does not provide individualized medical advice.
        </p>
      </section>

      <SiteFooter />
    </main>
  );
}
