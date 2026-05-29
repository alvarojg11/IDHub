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
      <div className="mb-6 rounded-[1.9rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(241,248,245,0.94))] p-5 shadow-[var(--shadow-medium)] sm:p-6 lg:p-7">
        <p className="idhub-kicker">Interactive Tool</p>
        <h1 className="mt-2 text-4xl font-semibold text-[var(--foreground)] sm:text-5xl">ProbID</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted)]">
          Build the case: choose syndrome and setting, add findings and tests, then see how the
          post-test probability compares to the treatment threshold.{" "}
          <span className="text-[var(--muted-soft)]">(Educational aid, not a guideline.)</span>
        </p>
      </div>

      <ProbIDTool modules={PROBID_MODULES} defaultModuleId="cap" />

      <SiteFooter />
    </section>
  );
}
