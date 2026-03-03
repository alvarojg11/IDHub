import Link from "next/link";
import SubscribeForm from "@/components/SubscribeForm";
import { CASES } from "@/lib/cases/registry";

const cases = CASES;

const CASES_PER_PAGE = 20;

function pageHref(page: number) {
  return page <= 1 ? "/cases" : `/cases?page=${page}`;
}

type CasesPageProps = {
  searchParams?: Promise<{ page?: string | string[] }>;
};

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
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
          Cases
        </h1>
        <p className="mt-4 max-w-3xl text-[var(--foreground)]/85">
          Interactive, stepwise clinical reasoning cases in infectious diseases.
          <span className="ml-2 text-[var(--muted)]">
            Designed for continuous learning through problem solving.
          </span>
        </p>

        <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
          <p className="text-sm font-semibold text-[var(--foreground)]">
            Would you like to collaborate with cases?
          </p>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Share an idea, case concept, or educational project.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--foreground)]"
            >
              Collaborate
            </Link>
          </div>
        </div>

        {totalPages > 1 ? (
          <nav
            aria-label="Cases pagination summary"
            className="mt-6 flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3"
          >
            <div>
              <div className="text-sm font-semibold text-[var(--foreground)]">
                Showing {shownCount} / {cases.length} cases
              </div>
              <div className="text-xs text-[var(--muted)]">
                Cases {start + 1}-{end} • Page {currentPage} of {totalPages}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {hasPrev ? (
                <Link
                  href={pageHref(currentPage - 1)}
                  className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--cardHover)]"
                >
                  ← Previous
                </Link>
              ) : (
                <span className="rounded-lg border border-[var(--border)] bg-white/60 px-3 py-2 text-sm font-semibold text-[var(--muted)]">
                  ← Previous
                </span>
              )}

              {hasNext ? (
                <Link
                  href={pageHref(currentPage + 1)}
                  className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--cardHover)]"
                >
                  Next →
                </Link>
              ) : (
                <span className="rounded-lg border border-[var(--border)] bg-white/60 px-3 py-2 text-sm font-semibold text-[var(--muted)]">
                  Next →
                </span>
              )}
            </div>
          </nav>
        ) : null}
      </header>

      <section className="grid gap-6 sm:grid-cols-2">
        {visibleCases.map((c) => (
          <Link
            key={c.slug}
            href={`/cases/${c.slug}`}
            className="group rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm hover:bg-[var(--cardHover)] transition"
          >
            <h2 className="text-xl font-semibold tracking-tight text-[var(--foreground)] group-hover:text-[var(--primary)] transition">
              {c.title}
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-[var(--foreground)]/80">
              {c.description}
            </p>

            <div className="mt-4 text-xs font-semibold text-[var(--primary)]">
              Open case →
            </div>
          </Link>
        ))}
      </section>

      {totalPages > 1 ? (
        <nav
          aria-label="Cases pagination"
          className="mt-8 flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3"
        >
          <div>
            <div className="text-sm font-semibold text-[var(--foreground)]">
              Showing {shownCount} / {cases.length} cases
            </div>
            <div className="text-xs text-[var(--muted)]">
              Cases {start + 1}-{end} • Page {currentPage} of {totalPages}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasPrev ? (
              <Link
                href={pageHref(currentPage - 1)}
                className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--cardHover)]"
              >
                ← Previous
              </Link>
            ) : (
              <span className="rounded-lg border border-[var(--border)] bg-white/60 px-3 py-2 text-sm font-semibold text-[var(--muted)]">
                ← Previous
              </span>
            )}

            {hasNext ? (
              <Link
                href={pageHref(currentPage + 1)}
                className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--cardHover)]"
              >
                Next →
              </Link>
            ) : (
              <span className="rounded-lg border border-[var(--border)] bg-white/60 px-3 py-2 text-sm font-semibold text-[var(--muted)]">
                Next →
              </span>
            )}
          </div>
        </nav>
      ) : null}

      <footer className="mt-16 border-t border-[var(--border)] pt-8 text-sm text-[var(--muted)] py-12">
        <div className="max-w-5xl mx-auto space-y-5">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
            <p className="text-sm font-semibold text-[var(--foreground)]">
              Get notified about new cases and blog posts
            </p>
            <div className="mt-3">
              <SubscribeForm compact />
            </div>
          </div>
          <p>
            IDHub is an educational project focused on clinical teaching in Infectious Disease.
          </p>
          <p>
            Content is for learning purposes only and does not replace clinical judgment,
            institutional guidelines, or consultation with infectious diseases specialists.
        </p>
          <p className="text-xs text-[var(--muted)]">
            © {new Date().getFullYear()} IDHub
        </p>
        </div>
      </footer>
    </main>
  );
}
