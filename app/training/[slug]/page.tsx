import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import CaseQuestion from "@/components/caseQuestion";
import CurriculumSectionNav from "@/components/CurriculumSectionNav";
import RegimenTable from "@/components/RegimenTable";
import SiteFooter from "@/components/SiteFooter";
import { CASES } from "@/lib/cases/registry";
import {
  CURRICULUM_MODULES,
  getCurriculumModule,
  getCurriculumModuleNeighbors,
  type Reading,
} from "@/lib/curriculum/modules";

const BASE_URL = "https://infectiousdiseasehub.com";

const difficultyLabel: Record<string, string> = {
  core: "Core",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const kindOrder: Reading["kind"][] = [
  "guideline",
  "review",
  "trial",
  "book",
  "pdf",
  "lecture",
];

const kindLabel: Record<Reading["kind"], string> = {
  guideline: "Guidelines",
  review: "Reviews",
  trial: "Key trials",
  book: "Books & reference",
  pdf: "PDFs",
  lecture: "Lectures",
};

export function generateStaticParams() {
  return CURRICULUM_MODULES.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const curriculumModule = getCurriculumModule(slug);
  if (!curriculumModule) return {};
  const url = `${BASE_URL}/training/${curriculumModule.slug}`;
  const title = `${curriculumModule.title} — ID Training Module`;
  return {
    title,
    description: curriculumModule.summary,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: "InfectiousDiseaseHub",
      title,
      description: curriculumModule.summary,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: curriculumModule.summary,
    },
  };
}

function formatDate(iso?: string): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function evidenceByKind(readings: Reading[]) {
  const groups: Record<string, Reading[]> = {};
  for (const r of readings) {
    (groups[r.kind] ??= []).push(r);
  }
  return kindOrder
    .filter((k) => groups[k]?.length)
    .map((k) => ({ kind: k, items: groups[k] }));
}

function relatedCases(mod: { syndromeTags: string[]; conceptTags: string[] }) {
  const tagSet = new Set(
    [...mod.syndromeTags, ...mod.conceptTags].map((t) =>
      t.toLowerCase().trim(),
    ),
  );
  return CASES.filter(
    (c) =>
      c.enable !== false &&
      (
        (c.tags?.syndromes ?? []).some((s) => tagSet.has(s.toLowerCase().trim())) ||
        (c.tags?.concepts ?? []).some((con) => tagSet.has(con.toLowerCase().trim()))
      ),
  ).slice(0, 6);
}

export default async function CurriculumModulePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const curriculumModule = getCurriculumModule(slug);
  if (!curriculumModule) notFound();
  const { prev, next } = getCurriculumModuleNeighbors(curriculumModule.slug);
  const evidenceGroups = evidenceByKind(curriculumModule.evidence);
  const related = relatedCases(curriculumModule);

  const lastReviewedLabel = formatDate(curriculumModule.lastReviewed);
  const lastUpdatedLabel = formatDate(curriculumModule.lastUpdated);

  const learningResourceSchema = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: curriculumModule.title,
    description: curriculumModule.summary,
    url: `${BASE_URL}/training/${curriculumModule.slug}`,
    educationalLevel: "Residency",
    learningResourceType: "Course",
    teachs: curriculumModule.objectives,
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "resident",
    },
    provider: {
      "@type": "Organization",
      name: "IDHub",
      url: BASE_URL,
    },
    author: {
      "@type": "Person",
      name: "Alvaro Ayala, MD",
      jobTitle: "Infectious Diseases Fellow",
      affiliation: { "@type": "Organization", name: "Stanford University" },
    },
    dateModified: curriculumModule.lastUpdated,
  };

  return (
    <div className="py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResourceSchema) }}
      />

      <div className="mb-6">
        <Link
          href="/training"
          className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)] hover:text-[var(--primary)]"
        >
          ← ID Training
        </Link>
      </div>

      <header className="border-b border-[var(--border)] pb-7">
        <p className="idhub-kicker">{curriculumModule.category}</p>
        <h1
          className="mt-2 text-[clamp(2rem,1.5rem+2vw,3rem)] font-bold leading-[1.1]"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {curriculumModule.title}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--ink-soft)]">
          {curriculumModule.summary}
        </p>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-[var(--muted)]">
          {curriculumModule.difficulty ? (
            <span>
              <span className="font-semibold text-[var(--foreground)]">
                {difficultyLabel[curriculumModule.difficulty]}
              </span>{" "}
              difficulty
            </span>
          ) : null}
          {curriculumModule.readMins ? (
            <span>~{curriculumModule.readMins} min read</span>
          ) : null}
          {lastReviewedLabel ? (
            <span>
              Last reviewed{" "}
              <span className="font-semibold text-[var(--foreground)]">
                {lastReviewedLabel}
              </span>
            </span>
          ) : null}
          {lastUpdatedLabel && lastUpdatedLabel !== lastReviewedLabel ? (
            <span>
              Updated{" "}
              <span className="font-semibold text-[var(--foreground)]">
                {lastUpdatedLabel}
              </span>
            </span>
          ) : null}
        </div>
      </header>

      <div className="grid gap-10 py-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
        <CurriculumSectionNav />
        <article
          data-module-article
          className="min-w-0 max-w-3xl"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {/* At a glance */}
          <section className="mb-12">
            <h2 className="border-b border-[var(--border)] pb-2 text-xl font-semibold text-[var(--foreground)]">
              At a glance
            </h2>
            <div className="mt-4 border-l-2 border-[var(--primary)] bg-[var(--background-soft)] px-5 py-4">
              <ul className="grid gap-2.5">
                {curriculumModule.atAGlance.map((point, i) => (
                  <li
                    key={i}
                    className="flex gap-3 text-[0.95rem] leading-6 text-[var(--ink-soft)]"
                  >
                    <span
                      aria-hidden
                      className="mt-[0.55rem] h-1 w-1 shrink-0 rounded-full bg-[var(--primary)]"
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Objectives */}
          <section className="mb-12">
            <h2 className="border-b border-[var(--border)] pb-2 text-xl font-semibold text-[var(--foreground)]">
              Objectives
            </h2>
            <ul className="mt-4 grid gap-2">
              {curriculumModule.objectives.map((obj, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-[0.95rem] leading-6 text-[var(--ink-soft)]"
                >
                  <span className="mt-0.5 shrink-0 font-semibold text-[var(--primary)]">
                    {i + 1}.
                  </span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Key concepts */}
          <section className="mb-12">
            <h2 className="border-b border-[var(--border)] pb-2 text-xl font-semibold text-[var(--foreground)]">
              Key concepts
            </h2>
            <div className="mt-3 grid gap-8">
              {curriculumModule.keyConcepts.map((section, i) => (
                <div key={i}>
                  <h3
                    className="text-lg font-semibold leading-snug text-[var(--foreground)]"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {section.heading}
                  </h3>
                  <p className="mt-2 leading-7 text-[var(--ink-soft)]">
                    {section.prose}
                  </p>
                  {section.bullets?.length ? (
                    <ul className="mt-3 grid gap-2">
                      {section.bullets.map((b, j) => (
                        <li
                          key={j}
                          className="flex gap-2.5 text-[0.92rem] leading-6 text-[var(--ink-soft)]"
                        >
                          <span
                            aria-hidden
                            className="mt-[0.55rem] h-1 w-1 shrink-0 rounded-full bg-[var(--primary)]"
                          />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {section.question ? (
                    <div className="mt-6">
                      <CaseQuestion
                        title="Self-check"
                        prompt={section.question.prompt}
                        options={section.question.options}
                        pollId={section.question.pollId}
                      />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </section>

          {/* Differential diagnosis */}
          {curriculumModule.differentials?.length ? (
            <section className="mb-12">
              <h2 className="border-b border-[var(--border)] pb-2 text-xl font-semibold text-[var(--foreground)]">
                Differential diagnosis
              </h2>
              <dl className="mt-4 grid gap-4">
                {curriculumModule.differentials.map((d, i) => (
                  <div
                    key={i}
                    className="border-l-2 border-[var(--border-strong)] pl-4"
                  >
                    <dt className="font-semibold text-[var(--foreground)]">
                      {d.diagnosis}
                    </dt>
                    <dd className="mt-1 text-[0.92rem] leading-6 text-[var(--muted)]">
                      {d.distinguishing}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}

          {/* Treatment regimens */}
          {curriculumModule.regimenTables?.length ? (
            <section className="mb-12">
              <h2 className="border-b border-[var(--border)] pb-2 text-xl font-semibold text-[var(--foreground)]">
                Treatment regimens
              </h2>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                Illustrative regimens — confirm with the source guideline and
                tailor to the patient, renal/hepatic function, allergies, and
                local antibiogram.
              </p>
              <div className="mt-3">
                {curriculumModule.regimenTables.map((table, i) => (
                  <RegimenTable key={i} table={table} />
                ))}
              </div>
            </section>
          ) : null}

          {/* Evidence & guidelines */}
          <section className="mb-12">
            <h2 className="border-b border-[var(--border)] pb-2 text-xl font-semibold text-[var(--foreground)]">
              Evidence &amp; guidelines
            </h2>
            <div className="mt-4 grid gap-6">
              {evidenceGroups.map(({ kind, items }) => (
                <div key={kind}>
                  <p className="idhub-kicker mb-2">{kindLabel[kind]}</p>
                  <ul className="grid gap-3">
                    {items.map((r, i) => (
                      <li key={i} className="leading-6">
                        {r.url ? (
                          <a
                            href={r.url}
                            target="_blank"
                            rel="noreferrer"
                            className="font-semibold text-[var(--primary)] hover:underline"
                          >
                            {r.title}
                          </a>
                        ) : (
                          <span className="font-semibold text-[var(--foreground)]">
                            {r.title}
                          </span>
                        )}
                        <span className="block text-[0.9rem] text-[var(--muted)]">
                          {r.source}
                        </span>
                        {r.focus ? (
                          <span className="mt-0.5 block text-[0.88rem] text-[var(--ink-soft)]">
                            {r.focus}
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Pearls */}
          <section className="mb-12">
            <h2 className="border-b border-[var(--border)] pb-2 text-xl font-semibold text-[var(--foreground)]">
              Pearls
            </h2>
            <ul className="mt-4 grid gap-3">
              {curriculumModule.pearls.map((pearl, i) => (
                <li
                  key={i}
                  className="flex gap-3 border border-[var(--border)] bg-[var(--background-soft)] px-4 py-3"
                >
                  <span className="idhub-kicker mt-0.5 shrink-0 text-[var(--primary)]">
                    Pearl
                  </span>
                  <span className="text-[0.92rem] leading-6 text-[var(--ink-soft)]">
                    {pearl}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Related cases */}
          {related.length > 0 ? (
            <section className="mb-12">
              <h2 className="border-b border-[var(--border)] pb-2 text-xl font-semibold text-[var(--foreground)]">
                Related cases
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {related.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/cases/${c.slug}`}
                    className="group block border border-[var(--border)] p-4 hover:border-[var(--primary)]"
                  >
                    <p className="idhub-kicker text-[0.6rem]">
                      {c.tags?.syndromes?.[0] ?? "Case"}
                    </p>
                    <p
                      className="mt-1 font-semibold leading-snug text-[var(--foreground)] group-hover:text-[var(--primary)]"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      {c.title}
                    </p>
                    {c.description ? (
                      <span className="mt-1 block text-[0.88rem] leading-6 text-[var(--muted)]">
                        {c.description}
                      </span>
                    ) : null}
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          {/* Clinical tools */}
          {curriculumModule.tools.length > 0 ? (
            <section className="mb-12">
              <h2 className="border-b border-[var(--border)] pb-2 text-xl font-semibold text-[var(--foreground)]">
                Clinical tools
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {curriculumModule.tools.map((t, i) => (
                  <Link
                    key={i}
                    href={t.href}
                    className="group block border border-[var(--border)] p-4 hover:border-[var(--primary)]"
                  >
                    <span className="font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)]">
                      {t.label}
                    </span>
                    {t.why ? (
                      <span className="mt-1 block text-[0.88rem] leading-6 text-[var(--muted)]">
                        {t.why}
                      </span>
                    ) : null}
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          {/* Further reading */}
          {curriculumModule.furtherReading?.length ? (
            <section className="mb-4">
              <h2 className="border-b border-[var(--border)] pb-2 text-xl font-semibold text-[var(--foreground)]">
                Further reading
              </h2>
              <ul className="mt-4 grid gap-3">
                {curriculumModule.furtherReading.map((r, i) => (
                  <li key={i} className="leading-6">
                    {r.url ? (
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-[var(--primary)] hover:underline"
                      >
                        {r.title}
                      </a>
                    ) : (
                      <span className="font-semibold text-[var(--foreground)]">
                        {r.title}
                      </span>
                    )}
                    <span className="block text-[0.9rem] text-[var(--muted)]">
                      {r.source}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </article>
      </div>

      <p className="border-t border-[var(--border)] pt-6 text-xs leading-6 text-[var(--muted)]">
        Educational content only. Verify dosing, durations, and recommendations
        against current guidelines and your institutional protocols. Does not
        replace specialist consultation.
      </p>

      {(prev || next) ? (
        <nav className="mt-8 grid gap-4 sm:grid-cols-2">
          {prev ? (
            <Link
              href={`/training/${prev.slug}`}
              className="group border border-[var(--border)] p-5 hover:border-[var(--primary)]"
            >
              <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                ← Previous module
              </span>
              <span
                className="mt-1 block text-lg font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {prev.title}
              </span>
            </Link>
          ) : (
            <span className="hidden sm:block" />
          )}
          {next ? (
            <Link
              href={`/training/${next.slug}`}
              className="group border border-[var(--primary)] bg-[var(--primary-tint)] p-5 text-right hover:bg-[var(--primary-soft)] sm:text-right"
            >
              <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                Next module →
              </span>
              <span
                className="mt-1 block text-lg font-semibold text-[var(--primary-strong)]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {next.title}
              </span>
            </Link>
          ) : null}
        </nav>
      ) : null}

      <SiteFooter />
    </div>
  );
}
