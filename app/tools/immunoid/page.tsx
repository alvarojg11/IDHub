import type { Metadata } from "next";

import ImmunoTool from "@/components/ImmunoTool";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "ImmunoID — Immunosuppression & Infection Risk Tool",
  description:
    "ImmunoID helps learners review immunosuppressive agents, mechanisms of action, and high-yield infection risks in one place.",
  alternates: { canonical: "https://infectiousdiseasehub.com/tools/immunoid" },
  openGraph: {
    type: "website",
    url: "https://infectiousdiseasehub.com/tools/immunoid",
    siteName: "InfectiousDiseaseHub",
    title: "ImmunoID | IDHub — Immunosuppression & Infection Risk Tool",
    description:
      "Review immunosuppressive agents, mechanisms of action, and high-yield infection risks.",
  },
  twitter: {
    card: "summary",
    title: "ImmunoID | IDHub — Immunosuppression & Infection Risk Tool",
    description:
      "Review immunosuppressive agents, mechanisms of action, and high-yield infection risks.",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "ImmunoID",
  url: "https://infectiousdiseasehub.com/tools/immunoid",
  description:
    "Review immunosuppressive agents, mechanisms of action, and high-yield infection risks.",
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

export default function ImmunoIDPage() {
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
            ImmunoID organizes immunosuppressive drugs around mechanisms and infection risk so the
            host side of Infectious Diseases care becomes easier to reason through.
          </p>
        </div>

        <div className="idhub-panel rounded-[1.8rem] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted-soft)]">
            Best for
          </p>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            Learners and clinicians who want a fast overview of immune-modifying therapies and the
            opportunistic patterns they should keep in mind.
          </p>
        </div>
      </div>

      <ImmunoTool />

      <SiteFooter />
    </section>
  );
}
