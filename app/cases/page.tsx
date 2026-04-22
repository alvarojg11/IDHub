import type { Metadata } from "next";

import CaseDirectory from "@/components/CaseDirectory";
import SiteFooter from "@/components/SiteFooter";

import { getAllCaseSyndromes, getCaseDirectoryEntries } from "@/lib/cases/directory";

const BASE_URL = "https://infectiousdiseasehub.com";

export const metadata: Metadata = {
  title: "Cases — Infectious Diseases Board Review Cases | IDHub",
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
    <section className="mx-auto max-w-6xl px-2 py-10 sm:px-4">
      <header className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:items-start">
        <div className="idhub-panel-strong rounded-[2rem] px-6 py-8 sm:px-8">
          <p className="idhub-kicker">ID Cases</p>
          <h1 className="mt-3 text-5xl font-semibold text-[var(--foreground)] sm:text-6xl">
            Cases
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--muted)] sm:text-lg">
            Master Infectious Diseases boards through clinical cases, diagnostic reasoning, and
            high-yield syndrome review.
          </p>
        </div>

        <aside className="idhub-panel rounded-[1.75rem] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted-soft)]">
            What to expect
          </p>
          <ul className="mt-4 space-y-4 text-sm leading-7 text-[var(--muted)]">
            <li>Stepwise cases grounded in bedside questions and uncertainty.</li>
            <li>Teaching-oriented cases that pair well with the interactive tools.</li>
            <li>{cases.length} published cases and growing.</li>
          </ul>
        </aside>
      </header>

      <section className="mt-10">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="idhub-kicker">Latest Cases</p>
            <h2 className="mt-2 text-3xl font-semibold text-[var(--foreground)]">
              Recent cases from IDHub
            </h2>
          </div>
        </div>

        <div className="idhub-panel rounded-[1.8rem] p-5 sm:p-6">
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
        </div>
      </section>

      <SiteFooter />
    </section>
  );
}
