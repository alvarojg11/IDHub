import type { Metadata } from "next";
import Link from "next/link";

import { CASES } from "@/lib/cases/registry";

const BASE_URL = "https://infectiousdiseasehub.com";

export const metadata: Metadata = {
  title: "Cases — Interactive Infectious Diseases Case-Based Learning",
  description:
    "Interactive, stepwise clinical reasoning cases covering tropical medicine, HIV, mycology, parasitology, and more. Free ID case-based learning for clinicians and trainees.",
  alternates: { canonical: `${BASE_URL}/cases` },
  openGraph: {
    type: "website",
    url: `${BASE_URL}/cases`,
    siteName: "InfectiousDiseaseHub",
    title: "Cases — Interactive ID Case-Based Learning | IDHub",
    description:
      "Interactive clinical reasoning cases covering tropical medicine, HIV, mycology, parasitology, and more.",
  },
  twitter: {
    card: "summary",
    title: "Cases — Interactive ID Case-Based Learning | IDHub",
    description:
      "Interactive clinical reasoning cases covering tropical medicine, HIV, mycology, parasitology, and more.",
  },
};

const cases = CASES;
const CASES_PER_PAGE = 18;

function pageHref(page: number) {
  return page <= 1 ? "/cases" : `/cases?page=${page}`;
}

type CasesPageProps = {
  searchParams?: Promise<{ page?: string | string[] }>;
};

function PaginationLink({
  href,
  disabled,
  label,
}: {
  href: string;
  disabled: boolean;
  label: string;
}) {
  if (disabled) {
    return (
      <span className="rounded-full border border-[var(--border)] bg-white/60 px-4 py-2 text-sm font-semibold text-[var(--muted)]">
        {label}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className="idhub-button-secondary px-4 py-2 text-sm font-semibold"
    >
      {label}
    </Link>
  );
}

export default async function CasesPage({ searchParams }: CasesPageProps) {
  const params = (await searchParams) ?? {};
  const pageParam = Array.isArray(params.page) ? params.page[0] : params.page;
  const parsedPage = Number.parseInt(pageParam ?? "1", 10);
  const totalPages = Math.max(1, Math.ceil(cases.length / CASES_PER_PAGE));
  const currentPage = Number.isFinite(parsedPage)
    ? Math.min(Math.max(parsedPage, 1), totalPages)
    : 1;
  const start = (currentPage - 1) * CASES_PER_PAGE;
  const visibleCases = cases.slice(start, start + CASES_PER_PAGE);
  const shownCount = visibleCases.length;
  const end = start + shownCount;
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <section className="mx-auto max-w-6xl px-2 py-10 sm:px-4">
      <header className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:items-start">
        <div className="idhub-panel-strong rounded-[2rem] px-6 py-8 sm:px-8">
          <p className="idhub-kicker">ID Cases</p>
          <h1 className="mt-3 text-5xl font-semibold text-[var(--foreground)] sm:text-6xl">
            Cases
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--muted)] sm:text-lg">
            Practical case-based learning on diagnostics, syndromes, and clinical uncertainty in
            Infectious Diseases. Cases now live directly inside IDHub so the case library feels
            like part of the same learning system as the tools and writing.
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
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {visibleCases.map((c) => (
              <article
                key={c.slug}
                className="group rounded-[1.6rem] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:border-[var(--border-strong)]"
              >
                <Link href={`/cases/${c.slug}`} className="block h-full">
                  <div className="flex h-full flex-col">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-soft)]">
                      Case
                    </p>
                    <h3 className="mt-4 text-3xl font-semibold text-[var(--foreground)] transition group-hover:text-[var(--primary)]">
                      {c.title}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{c.description}</p>
                    <span className="mt-auto pt-8 text-sm font-semibold text-[var(--primary)]">
                      Open case
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {totalPages > 1 ? (
        <section className="mt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-[var(--foreground)]">
                Cases {start + 1}-{end} of {cases.length}
              </p>
              <p className="text-sm text-[var(--muted)]">
                Page {currentPage} of {totalPages}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <PaginationLink
                href={pageHref(currentPage - 1)}
                disabled={!hasPrev}
                label="Previous"
              />
              <PaginationLink
                href={pageHref(currentPage + 1)}
                disabled={!hasNext}
                label="Next"
              />
            </div>
          </div>
        </section>
      ) : null}
    </section>
  );
}
