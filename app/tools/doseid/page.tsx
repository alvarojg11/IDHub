import type { Metadata } from "next";

import DoseIDTool from "@/components/DoseIDTool";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "DoseID — Antimicrobial Dosing Reference Tool",
  description:
    "DoseID is an educational antimicrobial dosing reference that combines medication selection, renal pathway logic, and patient calculations.",
  alternates: { canonical: "https://infectiousdiseasehub.com/tools/doseid" },
  openGraph: {
    type: "website",
    url: "https://infectiousdiseasehub.com/tools/doseid",
    siteName: "InfectiousDiseaseHub",
    title: "DoseID | IDHub — Antimicrobial Dosing Reference Tool",
    description:
      "Educational antimicrobial dosing reference with medication selection, renal pathway logic, and patient calculations.",
  },
  twitter: {
    card: "summary",
    title: "DoseID | IDHub — Antimicrobial Dosing Reference Tool",
    description:
      "Educational antimicrobial dosing reference with medication selection, renal pathway logic, and patient calculations.",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "DoseID",
  url: "https://infectiousdiseasehub.com/tools/doseid",
  description:
    "Educational antimicrobial dosing reference with medication selection, renal pathway logic, and patient calculations.",
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
    url: "https://infectiousdiseasehub.com",
  },
};

export default function DoseIDPage() {
  return (
    <section className="mx-auto max-w-7xl px-2 py-10 sm:px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="mb-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.85fr)]">
        <div className="idhub-panel rounded-[1.8rem] p-6">
          <p className="idhub-kicker">Tool Overview</p>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            DoseID is a practical dosing workspace for antimicrobial regimens, renal pathways, and
            patient-specific weight calculations in one place.
          </p>
        </div>

        <div className="idhub-panel rounded-[1.8rem] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted-soft)]">
            Best for
          </p>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            Fast bedside estimates, teaching discussions, and clearer dosing logic before checking
            local protocols or order-entry guidance.
          </p>
        </div>
      </div>

      <DoseIDTool />

      <SiteFooter />
    </section>
  );
}
