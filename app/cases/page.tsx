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
            Browse cases with less friction
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--muted)] sm:text-lg">
            Search by syndrome, organism, or teaching concept, then jump directly into the case you
            want. The latest cases appear first, and you can switch to an A-Z view whenever it is
            more useful.
          </p>
        </div>

        <aside className="idhub-panel rounded-[1.75rem] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted-soft)]">
            Navigate faster
          </p>
          <ul className="mt-4 space-y-4 text-sm leading-7 text-[var(--muted)]">
            <li>Search by title, organism, syndrome, or key teaching concept.</li>
            <li>Filter quickly when you want a narrower clinical pattern.</li>
            <li>{cases.length} published cases across {syndromes.length} syndrome categories.</li>
          </ul>
        </aside>
      </header>

      <section className="mt-10">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="idhub-kicker">Case Directory</p>
            <h2 className="mt-2 text-3xl font-semibold text-[var(--foreground)]">
              Move from one case to the next
            </h2>
          </div>
        </div>

        <div className="idhub-panel rounded-[1.8rem] p-5 sm:p-6">
          <CaseDirectory cases={cases} syndromes={syndromes} defaultSort="newest" />
        </div>
      </section>

      <SiteFooter />
    </section>
  );
}
