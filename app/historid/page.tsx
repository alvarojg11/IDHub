import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import SiteFooter from "@/components/SiteFooter";
import {
  HISTORID_CATEGORY_LABELS,
  getFeaturedHistoridEntries,
  getHistoridCategories,
  getHistoridEntries,
} from "@/lib/historid/registry";

const BASE_URL = "https://infectiousdiseasehub.com";

export const metadata: Metadata = {
  title: "HistorID — The History Behind Infectious Diseases",
  description:
    "Short historical teaching briefs on pathogens, antibiotics, outbreaks, vaccines, and the people who changed infectious diseases.",
  alternates: { canonical: `${BASE_URL}/historid` },
  openGraph: {
    type: "website",
    url: `${BASE_URL}/historid`,
    siteName: "InfectiousDiseaseHub",
    title: "HistorID — The History Behind Infectious Diseases | IDHub",
    description:
      "Short historical teaching briefs on pathogens, antibiotics, outbreaks, vaccines, and the people who changed infectious diseases.",
    images: [`${BASE_URL}/api/og/historid/index`],
  },
  twitter: {
    card: "summary_large_image",
    title: "HistorID — The History Behind Infectious Diseases | IDHub",
    description:
      "Short historical teaching briefs on pathogens, antibiotics, outbreaks, vaccines, and the people who changed infectious diseases.",
    images: [`${BASE_URL}/api/og/historid/index`],
  },
};

export default async function HistorIDPage() {
  const [entries, featuredEntries, categories] = await Promise.all([
    getHistoridEntries(),
    getFeaturedHistoridEntries(),
    getHistoridCategories(),
  ]);

  const featuredEntry = featuredEntries[0] ?? entries[0] ?? null;

  return (
    <section className="mx-auto max-w-6xl px-2 py-10 sm:px-4">
      <header className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:items-start">
        <div className="idhub-panel-strong rounded-[2rem] px-6 py-8 sm:px-8">
          <p className="idhub-kicker">HistorID</p>
          <h1 className="mt-3 text-5xl font-semibold text-[var(--foreground)] sm:text-6xl">
            The history behind infectious diseases
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--muted)] sm:text-lg">
            HistorID is a home for short historical teaching briefs on outbreaks, organisms,
            antibiotics, vaccines, and the people who changed Infectious Diseases.
          </p>
        </div>

        <aside className="idhub-panel rounded-[1.75rem] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted-soft)]">
            What to expect
          </p>
          <ul className="mt-4 space-y-4 text-sm leading-7 text-[var(--muted)]">
            <li>Short, image-led historical facts with a modern ID teaching takeaway.</li>
            <li>Stories that can work on the website and as social share cards.</li>
            <li>{entries.length} published HistorID brief{entries.length === 1 ? "" : "s"} so far.</li>
          </ul>
        </aside>
      </header>

      {categories.length > 0 ? (
        <section className="mt-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <span
                key={category.key}
                className="rounded-full border border-[var(--border)] bg-white/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]"
              >
                {category.label} · {category.count}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {featuredEntry ? (
        <section className="mt-10">
          <div className="mb-5">
            <p className="idhub-kicker">Featured Brief</p>
            <h2 className="mt-2 text-3xl font-semibold text-[var(--foreground)]">
              Start with this historical moment
            </h2>
          </div>

          <article className="overflow-hidden rounded-[1.9rem] border border-[var(--border)] bg-white shadow-[var(--shadow-soft)]">
            <div className="grid lg:grid-cols-[minmax(320px,0.95fr)_minmax(0,1.05fr)]">
              <div className="relative min-h-[280px] bg-[var(--background-soft)] lg:min-h-full">
                <Image
                  src={featuredEntry.heroImage}
                  alt={featuredEntry.heroImageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 480px"
                />
              </div>

              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-[var(--primary-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">
                    {featuredEntry.historicalDateLabel}
                  </span>
                  {featuredEntry.categories.map((category) => (
                    <span
                      key={category}
                      className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]"
                    >
                      {HISTORID_CATEGORY_LABELS[category]}
                    </span>
                  ))}
                </div>

                <h3 className="mt-5 text-4xl font-semibold text-[var(--foreground)]">
                  {featuredEntry.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{featuredEntry.description}</p>
                <p className="mt-5 text-base leading-8 text-[var(--foreground)]">{featuredEntry.hook}</p>

                <Link
                  href={featuredEntry.url}
                  className="idhub-button-primary mt-8 inline-flex px-5 py-3 text-sm font-semibold"
                >
                  Read HistorID brief
                </Link>
              </div>
            </div>
          </article>
        </section>
      ) : null}

      <section className="mt-10">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="idhub-kicker">HistorID Library</p>
            <h2 className="mt-2 text-3xl font-semibold text-[var(--foreground)]">
              Recent historical briefs
            </h2>
          </div>
        </div>

        <div className="idhub-panel rounded-[1.8rem] p-5 sm:p-6">
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {entries.map((entry) => (
              <article
                key={entry.slug}
                className="group overflow-hidden rounded-[1.6rem] border border-[var(--border)] bg-white shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:border-[var(--border-strong)]"
              >
                <Link href={entry.url} className="block h-full">
                  <div className="relative aspect-[4/3] w-full bg-[var(--background-soft)]">
                    <Image
                      src={entry.heroImage}
                      alt={entry.heroImageAlt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1280px) 50vw, 360px"
                    />
                  </div>

                  <div className="flex h-full flex-col p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-soft)]">
                      {entry.historicalDateLabel}
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold text-[var(--foreground)] transition group-hover:text-[var(--primary)]">
                      {entry.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{entry.description}</p>
                    <span className="mt-auto pt-6 text-sm font-semibold text-[var(--primary)]">
                      Read brief
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </section>
  );
}
