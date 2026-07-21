import type { Metadata } from "next";

import CaseDirectory from "@/components/CaseDirectory";
import SiteFooter from "@/components/SiteFooter";

import { getAllCaseSyndromes, getCaseDirectoryEntries } from "@/lib/cases/directory";

const BASE_URL = "https://infectiousdiseasehub.com";

export const metadata: Metadata = {
  title: "Cases — Infectious Diseases Board Review Cases",
  description:
    "Master Infectious Diseases boards through clinical cases, diagnostic reasoning, and high-yield syndrome review. Explore free ID board-style cases for clinicians and trainees.",
  alternates: { canonical: `${BASE_URL}/cases` },
  openGraph: {
    type: "website",
    url: `${BASE_URL}/cases`,
    siteName: "InfectiousDiseaseHub",
    title: "Cases — Infectious Diseases Board Review Cases | IDHub",
    description:
      "Master Infectious Diseases boards through clinical cases, diagnostic reasoning, and high-yield syndrome review.",
  },
  twitter: {
    card: "summary",
    title: "Cases — Infectious Diseases Board Review Cases | IDHub",
    description:
      "Master Infectious Diseases boards through clinical cases, diagnostic reasoning, and high-yield syndrome review.",
  },
};

const cases = getCaseDirectoryEntries();
const syndromes = getAllCaseSyndromes();

export default function CasesPage() {
  return (
    <div className="py-8">
      <header className="border-b border-[var(--border)] pb-8">
        <p className="idhub-kicker">ID Cases</p>
        <h1 className="mt-2 text-[clamp(2.2rem,1.6rem+2.4vw,3.4rem)] font-bold">
          Cases
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--ink-soft)]">
          Master Infectious Diseases boards through clinical cases, diagnostic
          reasoning, and high-yield syndrome review.{" "}
          <span className="text-[var(--muted)]">
            {cases.length} published cases and growing.
          </span>
        </p>
      </header>

      <section className="pt-8">
        <CaseDirectory
          cases={cases}
          syndromes={syndromes}
          defaultSort="newest"
          cardVariant="simple"
          showPublishedDate={false}
          showOrganisms={false}
          showSyndromeTags={false}
          syndromeFilterStyle="select"
        />
      </section>

      <SiteFooter />
    </div>
  );
}
