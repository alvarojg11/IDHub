import type { ReactNode } from "react";

import Image from "next/image";
import Link from "next/link";

import SiteFooter from "@/components/SiteFooter";
import { buildHistoridStructuredData } from "@/lib/historid/seo";
import { HISTORID_CATEGORY_LABELS, type HistorIDMeta } from "@/lib/historid/registry";

type HistorIDShellProps = {
  fact: HistorIDMeta;
  children: ReactNode;
};

function formatPublishedAt(input: string) {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function HistorIDShell({ fact, children }: HistorIDShellProps) {
  const publishedLabel = formatPublishedAt(fact.publishedAt);
  const structuredData = buildHistoridStructuredData(fact);
  const heroImageClassName = fact.hookImageFit === "contain" ? "object-contain p-6" : "object-cover";

  return (
    <section className="mx-auto max-w-6xl px-2 py-10 sm:px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <article className="mx-auto max-w-5xl">
        <header className="idhub-reading-shell rounded-[2rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(241,248,245,0.95))] p-6 shadow-[var(--shadow-medium)] sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="idhub-kicker">HistorID</p>
              <h1 className="mt-3 text-4xl font-semibold text-[var(--foreground)] sm:text-5xl">
                {fact.title}
              </h1>
            </div>

            <Link
              href="/historid"
              className="idhub-button-secondary inline-flex px-4 py-2 text-sm font-semibold"
            >
              Back to HistorID
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 text-sm text-[var(--muted)]">
            <span className="rounded-full border border-[var(--border)] bg-white/85 px-3 py-1.5 font-medium text-[var(--foreground)]">
              {fact.historicalDateLabel}
            </span>
            {publishedLabel ? <span>Published {publishedLabel}</span> : null}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {fact.categories.map((category) => (
              <span
                key={category}
                className="rounded-full bg-[var(--primary-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--primary)]"
              >
                {HISTORID_CATEGORY_LABELS[category]}
              </span>
            ))}
          </div>

          <div className="mt-7 rounded-[1.5rem] border border-[var(--border)] bg-[var(--background-soft)] p-5 text-base leading-8 text-[var(--muted)]">
            <p className="font-medium text-[var(--foreground)]">{fact.hook}</p>
            <p className="mt-3">{fact.takeaway}</p>
          </div>
        </header>

        <figure className="mt-8 overflow-hidden rounded-[1.8rem] border border-[var(--border)] bg-white shadow-[var(--shadow-soft)]">
          <div className="relative aspect-[16/9] w-full bg-[var(--background-soft)]">
            <Image
              src={fact.heroImage}
              alt={fact.heroImageAlt}
              fill
              className={heroImageClassName}
              priority
              sizes="(max-width: 1024px) 100vw, 960px"
            />
          </div>

          {(fact.heroImageCredit || fact.heroImageLicense || fact.heroImageSourceUrl) ? (
            <figcaption className="flex flex-wrap items-center gap-2 px-5 py-3 text-sm text-[var(--muted)]">
              {fact.heroImageCredit ? <span>{fact.heroImageCredit}</span> : null}
              {fact.heroImageLicense ? <span>· {fact.heroImageLicense}</span> : null}
              {fact.heroImageSourceUrl ? (
                <a href={fact.heroImageSourceUrl} target="_blank" rel="noreferrer">
                  Source
                </a>
              ) : null}
            </figcaption>
          ) : null}
        </figure>

        <section className="idhub-blog-content mt-8 rounded-[1.9rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(247,251,249,0.94))] p-5 shadow-[var(--shadow-soft)] sm:p-8">
          {children}
        </section>
      </article>

      <SiteFooter />
    </section>
  );
}
