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

      <article className="mx-auto max-w-4xl">
        <header className="border-b border-[var(--border-strong)] pb-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="idhub-kicker">HistorID</p>
              <h1 className="mt-3 text-[clamp(2.15rem,1.55rem+2.4vw,3.7rem)] font-semibold leading-[1.05] text-[var(--foreground)]">
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
            <span className="border border-[var(--border)] bg-white px-3 py-1.5 font-medium text-[var(--foreground)]">
              {fact.historicalDateLabel}
            </span>
            {publishedLabel ? <span>Published {publishedLabel}</span> : null}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {fact.categories.map((category) => (
              <span
                key={category}
                className="border border-[var(--border)] bg-[var(--primary-tint)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--primary)]"
              >
                {HISTORID_CATEGORY_LABELS[category]}
              </span>
            ))}
          </div>

          <div className="idhub-editorial-inset mt-7 px-5 py-4 text-base leading-8 text-[var(--muted)]">
            <p className="font-medium text-[var(--foreground)]">{fact.hook}</p>
            <p className="mt-3">{fact.takeaway}</p>
          </div>
        </header>

        <figure className="mt-8 overflow-hidden border border-[var(--border)] bg-white">
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
            <figcaption className="flex flex-wrap items-center gap-2 border-t border-[var(--border)] px-5 py-3 text-sm text-[var(--muted)]">
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

        <section className="idhub-blog-content mt-8">
          {children}
        </section>
      </article>

      <SiteFooter />
    </section>
  );
}
