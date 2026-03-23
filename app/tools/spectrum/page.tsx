import type { Metadata } from "next";

import SiteFooter from "@/components/SiteFooter";
import SpectrumTool from "@/components/SpectrumTool";

const BASE_URL = "https://infectiousdiseasehub.com";

export const metadata: Metadata = {
  title: "Antimicrobial Spectrum Reference",
  description:
    "Searchable antimicrobial spectrum of activity chart for common bacteria. Compare expected susceptibility patterns across antibiotics for Gram-positive, Gram-negative, anaerobic, and atypical organisms.",
  keywords: [
    "antibiotic spectrum of activity",
    "antimicrobial susceptibility chart",
    "bug-drug chart",
    "antibiogram reference",
    "empiric antibiotic therapy",
    "MRSA treatment",
    "Pseudomonas antibiotics",
    "Gram-negative coverage",
    "infectious diseases education",
  ],
  alternates: { canonical: `${BASE_URL}/tools/spectrum` },
  openGraph: {
    type: "website",
    url: `${BASE_URL}/tools/spectrum`,
    siteName: "InfectiousDiseaseHub",
    title: "Antimicrobial Spectrum Reference | IDHub",
    description:
      "Searchable antimicrobial spectrum of activity chart for common bacteria.",
  },
  twitter: {
    card: "summary",
    title: "Antimicrobial Spectrum Reference | IDHub",
    description:
      "Searchable antimicrobial spectrum of activity chart for common bacteria.",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Antimicrobial Spectrum Reference",
  url: `${BASE_URL}/tools/spectrum`,
  description:
    "Searchable antimicrobial spectrum of activity chart comparing expected susceptibility patterns across common organisms and antibiotics.",
  applicationCategory: "Medical Education",
  operatingSystem: "Web",
  author: {
    "@type": "Person",
    name: "Alvaro Ayala",
    affiliation: { "@type": "Organization", name: "Stanford University" },
  },
  isPartOf: {
    "@type": "WebSite",
    name: "InfectiousDiseaseHub",
    url: BASE_URL,
  },
};

export default function SpectrumPage() {
  return (
    <section className="mx-auto max-w-full px-2 py-10 sm:px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="mx-auto max-w-6xl">
        <header className="mb-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.85fr)]">
          <div className="idhub-panel-strong rounded-[2rem] px-6 py-8 sm:px-8">
            <p className="idhub-kicker">Tool</p>
            <h1 className="mt-3 text-4xl font-semibold text-[var(--foreground)] sm:text-5xl">
              Antimicrobial Spectrum
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--muted)] sm:text-lg">
              A quick-reference chart of expected antimicrobial susceptibility
              patterns for commonly encountered organisms. Search by organism
              or filter by Gram stain category.
            </p>
          </div>

          <aside className="idhub-panel rounded-[1.75rem] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted-soft)]">
              How to read
            </p>
            <div className="mt-4 space-y-2 text-sm leading-7 text-[var(--muted)]">
              <p>
                <span className="inline-block w-7 rounded bg-emerald-100 text-center font-bold text-emerald-700">
                  S
                </span>{" "}
                Usually susceptible
              </p>
              <p>
                <span className="inline-block w-7 rounded bg-amber-100 text-center font-bold text-amber-700">
                  I
                </span>{" "}
                Variable / intermediate
              </p>
              <p>
                <span className="inline-block w-7 rounded bg-red-100 text-center font-bold text-red-700">
                  R
                </span>{" "}
                Usually resistant
              </p>
            </div>
            <p className="mt-4 text-xs leading-6 text-[var(--muted-soft)]">
              Educational reference only. Real susceptibility depends on local
              antibiograms and CLSI/EUCAST breakpoints.
            </p>
          </aside>
        </header>
      </div>

      <SpectrumTool />

      <div className="mx-auto max-w-6xl">
        <SiteFooter />
      </div>
    </section>
  );
}
