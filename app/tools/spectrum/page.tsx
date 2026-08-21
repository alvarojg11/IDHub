import type { Metadata } from "next";

import SiteFooter from "@/components/SiteFooter";
import SpectrumTool from "@/components/SpectrumTool";

const BASE_URL = "https://infectiousdiseasehub.com";

export const metadata: Metadata = {
  title: "Antibacterial Spectrum Navigator",
  description:
    "Bug-drug antibacterial spectrum navigator for common bacteria, highlighting preferred therapy, expected activity, variable susceptibility, site-only use, and major caveats.",
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
    title: "Antibacterial Spectrum Navigator | IDHub",
    description:
      "Bug-drug antibacterial spectrum navigator for common bacteria.",
  },
  twitter: {
    card: "summary",
    title: "Antibacterial Spectrum Navigator | IDHub",
    description:
      "Bug-drug antibacterial spectrum navigator for common bacteria.",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Antibacterial Spectrum Navigator",
  url: `${BASE_URL}/tools/spectrum`,
  description:
    "Bug-drug antibacterial spectrum navigator comparing expected activity and clinical caveats across common organisms and antibiotics.",
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
              Antibacterial Spectrum
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--muted)] sm:text-lg">
              A bug-drug navigator for commonly encountered bacteria. Switch
              between organism-first, antibiotic-first, and matrix views while
              keeping preferred therapy separate from raw activity.
            </p>
          </div>

          <aside className="idhub-panel rounded-[1.75rem] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted-soft)]">
              How to read
            </p>
            <div className="mt-4 space-y-2 text-sm leading-7 text-[var(--muted)]">
              <p>
                <span className="inline-block w-7 rounded bg-emerald-100 text-center font-bold text-emerald-700">
                  P
                </span>{" "}
                Preferred when the syndrome fits
              </p>
              <p>
                <span className="inline-block w-7 rounded bg-sky-100 text-center font-bold text-sky-700">
                  A
                </span>{" "}
                Active but not necessarily preferred
              </p>
              <p>
                <span className="inline-block w-7 rounded bg-amber-100 text-center font-bold text-amber-700">
                  V
                </span>{" "}
                Variable; check susceptibility
              </p>
            </div>
            <p className="mt-4 text-xs leading-6 text-[var(--muted-soft)]">
              Educational reference only. Real treatment depends on syndrome,
              source control, severity, host factors, AST, breakpoints, and
              local antibiograms.
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
