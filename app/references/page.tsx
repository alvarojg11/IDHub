import type { Metadata } from "next";

import { CASES } from "@/lib/cases/registry";

import SiteFooter from "@/components/SiteFooter";
import ReferenceIndex from "@/components/ReferenceIndex";

const BASE_URL = "https://infectiousdiseasehub.com";

export const metadata: Metadata = {
  title: "Organism & Syndrome Index",
  description:
    "Browse IDHub clinical cases by organism, syndrome, or clinical concept. Find infectious diseases case studies for Burkholderia, Cryptococcus, HIV, parasitology, and more.",
  keywords: [
    "infectious diseases organisms",
    "clinical case index",
    "microbiology case studies",
    "ID board review",
    "infectious diseases syndromes",
    "medical education",
  ],
  alternates: { canonical: `${BASE_URL}/references` },
  openGraph: {
    type: "website",
    url: `${BASE_URL}/references`,
    siteName: "InfectiousDiseaseHub",
    title: "Organism & Syndrome Index | IDHub",
    description:
      "Browse IDHub clinical cases by organism, syndrome, or clinical concept.",
  },
  twitter: {
    card: "summary",
    title: "Organism & Syndrome Index | IDHub",
    description:
      "Browse IDHub clinical cases by organism, syndrome, or clinical concept.",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "IDHub Organism & Syndrome Index",
  url: `${BASE_URL}/references`,
  description:
    "Browse infectious diseases clinical cases by organism, syndrome, or clinical concept.",
  isPartOf: {
    "@type": "WebSite",
    name: "InfectiousDiseaseHub",
    url: BASE_URL,
  },
};

export default function ReferencesPage() {
  // Build serializable case data for the client component
  const cases = CASES.map((c) => ({
    slug: c.slug,
    title: c.title,
    description: c.description ?? "",
    organisms: c.tags?.organisms ?? [],
    syndromes: c.tags?.syndromes ?? [],
    concepts: c.tags?.concepts ?? [],
  }));

  // Collect all unique syndromes for the filter
  const allSyndromes = [
    ...new Set(CASES.flatMap((c) => c.tags?.syndromes ?? [])),
  ].sort();

  return (
    <section className="mx-auto max-w-6xl px-2 py-10 sm:px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <header className="mb-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.85fr)]">
        <div className="idhub-panel-strong rounded-[2rem] px-6 py-8 sm:px-8">
          <p className="idhub-kicker">Reference</p>
          <h1 className="mt-3 text-4xl font-semibold text-[var(--foreground)] sm:text-5xl">
            Organism &amp; Syndrome Index
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--muted)] sm:text-lg">
            Find IDHub clinical cases by organism name, syndrome category, or
            clinical concept. Search for any pathogen or presentation to jump
            directly to the relevant case.
          </p>
        </div>

        <aside className="idhub-panel rounded-[1.75rem] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted-soft)]">
            What&rsquo;s here
          </p>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
            Every case on IDHub is tagged with its causative organism, clinical
            syndrome, and key teaching concepts. Use this page to find exactly
            what you need for study, review, or teaching.
          </p>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            <strong className="text-[var(--foreground)]">{cases.length}</strong>{" "}
            cases across{" "}
            <strong className="text-[var(--foreground)]">
              {allSyndromes.length}
            </strong>{" "}
            syndrome categories.
          </p>
        </aside>
      </header>

      <ReferenceIndex cases={cases} syndromes={allSyndromes} />

      <SiteFooter />
    </section>
  );
}
