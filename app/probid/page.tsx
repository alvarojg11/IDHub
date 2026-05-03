import type { Metadata } from "next";

import { ProbIDTool } from "@/components/ProbIDTool";
import SiteFooter from "@/components/SiteFooter";
import { PROBID_MODULES } from "@/lib/lrSyndromes";

export const metadata: Metadata = {
  title: "ProbID — Diagnostic Probability & Treatment Threshold Tool",
  description:
    "ProbID is an educational diagnostic reasoning tool that uses pretest probability, likelihood ratios, and expected-utility treatment thresholds for Infectious Diseases syndromes.",
  alternates: { canonical: "https://infectiousdiseasehub.com/probid" },
  openGraph: {
    type: "website",
    url: "https://infectiousdiseasehub.com/probid",
    siteName: "InfectiousDiseaseHub",
    title: "ProbID | IDHub — Diagnostic Probability & Treatment Threshold Tool",
    description:
      "Educational tool using pretest probability, likelihood ratios, and treatment thresholds for Infectious Diseases diagnostic reasoning.",
  },
  twitter: {
    card: "summary",
    title: "ProbID | IDHub — Diagnostic Probability & Treatment Threshold Tool",
    description:
      "Educational tool using pretest probability, likelihood ratios, and treatment thresholds for Infectious Diseases diagnostic reasoning.",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "ProbID",
  url: "https://infectiousdiseasehub.com/probid",
  description:
    "Educational diagnostic reasoning tool using pretest probability, likelihood ratios, and treatment thresholds for Infectious Diseases syndromes.",
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

export default function ProbIDPage() {
  return (
    <section className="mx-auto max-w-7xl px-2 py-10 sm:px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="mb-8 grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(260px,0.7fr)_minmax(260px,0.7fr)]">
        <div className="idhub-panel rounded-[1.8rem] p-6 lg:p-7">
          <p className="idhub-kicker">Tool Overview</p>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            ProbID turns pretest thinking into a visible workflow by combining setting, findings,
            and likelihood ratios into an educational post-test estimate, then comparing that
            probability with a treatment threshold.
          </p>
        </div>

        <div className="idhub-panel rounded-[1.8rem] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted-soft)]">
            Use it for
          </p>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            CAP, VAP, endocarditis, invasive mold, and other syndromes where diagnostic uncertainty
            matters more than rote recall and where a probability estimate can change what you do next.
          </p>
        </div>

        <div className="idhub-panel rounded-[1.8rem] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted-soft)]">
            Best for
          </p>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            Clinicians who want a structured way to move from suspicion to action without pretending the diagnosis is binary.
          </p>
        </div>
      </div>

      <ProbIDTool modules={PROBID_MODULES} defaultModuleId="cap" />

      <SiteFooter />
    </section>
  );
}
