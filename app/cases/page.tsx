import Link from "next/link";

import SiteFooter from "@/components/SiteFooter";
import { CASES } from "@/lib/cases/registry";

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
      <header className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)] lg:items-start">
        <div className="idhub-panel-strong rounded-[2rem] px-6 py-8 sm:px-8">
          <p className="idhub-kicker">Case Library</p>
          <h1 className="mt-3 text-5xl font-semibold text-[var(--foreground)] sm:text-6xl">
            Cases
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--muted)] sm:text-lg">
            Interactive, stepwise clinical reasoning cases in Infectious Diseases, built to make
            uncertainty more teachable and problem solving more deliberate.
          </p>

          <div className="mt-8 grid gap-4 border-t border-[var(--border)] pt-6 sm:grid-cols-3">
            <div>
              <p className="text-3xl font-semibold text-[var(--foreground)]">{cases.length}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">total published cases</p>
            </div>
            <div>
              <p className="text-3xl font-semibold text-[var(--foreground)]">{shownCount}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">shown on this page</p>
            </div>
            <div>
              <p className="text-3xl font-semibold text-[var(--foreground)]">{currentPage}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">current page</p>
            </div>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="idhub-panel rounded-[1.75rem] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted-soft)]">
              Collaboration
            </p>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
              Have a case concept, teaching idea, or educational project that belongs on IDHub?
            </p>
            <Link
              href="/contact"
              className="idhub-button-secondary mt-5 inline-flex px-4 py-2.5 text-sm font-semibold"
            >
              Collaborate
            </Link>
          </div>

          <div className="idhub-panel rounded-[1.75rem] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted-soft)]">
              Page Summary
            </p>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
              Showing cases {start + 1}-{end} of {cases.length}. Page {currentPage} of {totalPages}.
            </p>
          </div>
        </aside>
      </header>

      <section className="mt-10">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="idhub-kicker">Current Selection</p>
            <h2 className="mt-2 text-3xl font-semibold text-[var(--foreground)]">
              Stepwise case-based learning
            </h2>
          </div>
        </div>

        <div className="idhub-panel rounded-[1.8rem] p-5 sm:p-6">
          {totalPages > 1 ? (
            <div className="mb-6 flex flex-col gap-4 border-b border-[var(--border)] pb-5 sm:flex-row sm:items-center sm:justify-between">
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
          ) : null}

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {visibleCases.map((c) => (
              <Link
                key={c.slug}
                href={`/cases/${c.slug}`}
                className="group rounded-[1.6rem] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:border-[var(--border-strong)]"
              >
                <h3 className="text-3xl font-semibold text-[var(--foreground)] transition group-hover:text-[var(--primary)]">
                  {c.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{c.description}</p>
                <div className="mt-8 text-sm font-semibold text-[var(--primary)]">Open case</div>
              </Link>
            ))}
          </div>

          {totalPages > 1 ? (
            <div className="mt-6 flex flex-col gap-4 border-t border-[var(--border)] pt-5 sm:flex-row sm:items-center sm:justify-between">
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
          ) : null}
        </div>
      </section>

      <SiteFooter />
    </section>
  );
}
