"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { getCaseDateEntry } from "@/lib/cases/dates";
import { getPrevNext, getRelatedCases } from "@/lib/cases/registry";

function slugFromPath(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  const casesIndex = parts.indexOf("cases");
  if (casesIndex === -1) return null;
  return parts[casesIndex + 1] ?? null;
}

function formatCaseDate(slug: string) {
  const publishedAt = getCaseDateEntry(slug)?.publishedAt;
  if (!publishedAt) return null;

  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(publishedAt));
  } catch {
    return null;
  }
}

function CaseLinkCard({
  href,
  kicker,
  title,
  description,
  slug,
  syndromes,
}: {
  href: string;
  kicker: string;
  title: string;
  description?: string;
  slug: string;
  syndromes?: string[];
}) {
  const publishedLabel = formatCaseDate(slug);

  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-[1.6rem] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-medium)]"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-soft)]">
          {kicker}
        </p>
        {publishedLabel ? (
          <p className="rounded-full bg-[var(--background-soft)] px-2.5 py-1 text-[11px] font-medium text-[var(--muted)]">
            {publishedLabel}
          </p>
        ) : null}
      </div>

      <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)] transition group-hover:text-[var(--primary)]">
        {title}
      </h2>

      {syndromes && syndromes.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {syndromes.slice(0, 2).map((item) => (
            <span
              key={item}
              className="rounded-full bg-[var(--primary-soft)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--primary)]"
            >
              {item}
            </span>
          ))}
        </div>
      ) : null}

      {description ? (
        <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{description}</p>
      ) : null}

      <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-[var(--primary)]">
        Open case
        <span className="transition-transform group-hover:translate-x-1">→</span>
      </span>
    </Link>
  );
}

export default function CaseNavAuto() {
  const pathname = usePathname();
  const slug = slugFromPath(pathname);

  if (!slug) return null;

  const { prev, next } = getPrevNext(slug, "newest");
  const relatedCases = getRelatedCases(slug, 3);

  if (!prev && !next && relatedCases.length === 0) {
    return null;
  }

  return (
    <section className="mt-24">
      <div className="rounded-[1.9rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(241,248,245,0.95))] p-6 shadow-[var(--shadow-medium)] sm:p-7">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="idhub-kicker">Keep Exploring</p>
            <h2 className="mt-2 text-3xl font-semibold text-[var(--foreground)]">Move between cases</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
              Use the published-case sequence when you want to keep scrolling, or branch into related
              topics when a case opens up a new clinical thread.
            </p>
          </div>
          <Link href="/cases" className="idhub-button-secondary px-4 py-2.5 text-sm font-semibold">
            Browse all cases
          </Link>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {prev ? (
            <CaseLinkCard
              href={`/cases/${prev.slug}`}
              kicker="Newer case"
              title={prev.title}
              description={prev.description}
              slug={prev.slug}
              syndromes={prev.tags?.syndromes}
            />
          ) : (
            <div className="rounded-[1.6rem] border border-dashed border-[var(--border-strong)] bg-white/60 p-5 text-sm leading-7 text-[var(--muted)]">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-soft)]">
                Newer case
              </p>
              <p className="mt-3 font-semibold text-[var(--foreground)]">You are at the newest published case.</p>
              You are at the newest published case in this sequence.
            </div>
          )}

          <div className="rounded-[1.6rem] border border-[var(--border)] bg-[var(--background-soft)] p-5 text-sm leading-7 text-[var(--muted)] shadow-[0_12px_28px_rgba(13,30,24,0.05)]">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-soft)]">
              Case index
            </p>
            <p className="mt-3 text-lg font-semibold text-[var(--foreground)]">
              Jump back into the full library
            </p>
            <p className="mt-3">
              Search by organism, syndrome, or concept when you want to branch out instead of staying
              in the newest-case sequence.
            </p>
            <Link href="/cases" className="mt-5 inline-flex text-sm font-semibold text-[var(--primary)]">
              Open the case hub
            </Link>
          </div>

          {next ? (
            <CaseLinkCard
              href={`/cases/${next.slug}`}
              kicker="Older case"
              title={next.title}
              description={next.description}
              slug={next.slug}
              syndromes={next.tags?.syndromes}
            />
          ) : (
            <div className="rounded-[1.6rem] border border-dashed border-[var(--border-strong)] bg-white/60 p-5 text-sm leading-7 text-[var(--muted)]">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-soft)]">
                Older case
              </p>
              <p className="mt-3 font-semibold text-[var(--foreground)]">You have reached the end of this sequence.</p>
              You have reached the end of the current newest-to-oldest case sequence.
            </div>
          )}
        </div>

        {relatedCases.length > 0 ? (
          <div className="mt-10">
            <div className="mb-4">
              <p className="idhub-kicker">Related Cases</p>
              <h3 className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
                Keep the same clinical thread going
              </h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {relatedCases.map((item) => (
                <CaseLinkCard
                  key={item.slug}
                  href={`/cases/${item.slug}`}
                  kicker="Related case"
                  title={item.title}
                  description={item.description}
                  slug={item.slug}
                  syndromes={item.tags?.syndromes}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
