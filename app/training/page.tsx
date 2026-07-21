import type { Metadata } from "next";
import Link from "next/link";

import SiteFooter from "@/components/SiteFooter";
import {
  CURRICULUM_CATEGORIES,
  CURRICULUM_MODULES,
} from "@/lib/curriculum/modules";

const BASE_URL = "https://infectiousdiseasehub.com";

export const metadata: Metadata = {
  title: "ID Training — A Structured Infectious Diseases Curriculum for Residents",
  description:
    "A free, structured Infectious Diseases curriculum for Internal Medicine and Family Medicine residents: learning objectives, key concepts, guidelines, pearls, cases, and self-assessment questions.",
  alternates: { canonical: `${BASE_URL}/training` },
  openGraph: {
    type: "website",
    url: `${BASE_URL}/training`,
    siteName: "InfectiousDiseaseHub",
    title: "ID Training — A Structured ID Curriculum for Residents | IDHub",
    description:
      "Objectives, key concepts, guidelines, pearls, cases, and self-assessment questions — a structured ID curriculum for residents.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ID Training — A Structured ID Curriculum for Residents | IDHub",
    description:
      "Objectives, key concepts, guidelines, pearls, cases, and self-assessment questions for IM/FM residents.",
  },
};

const difficultyLabel: Record<string, string> = {
  core: "Core",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const learningResourceSchema = {
  "@context": "https://schema.org",
  "@type": "LearningResource",
  name: "ID Training — IDHub Curriculum",
  description:
    "A structured Infectious Diseases curriculum for Internal Medicine and Family Medicine residents.",
  url: `${BASE_URL}/training`,
  educationalLevel: "Residency",
  audience: {
    "@type": "EducationalAudience",
    educationalRole: "resident",
  },
  learningResourceType: "Course",
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
};

export default function TrainingPage() {
  return (
    <div className="py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(learningResourceSchema),
        }}
      />

      <header className="border-b border-[var(--border)] pb-8">
        <p className="idhub-kicker">For residents &amp; trainees</p>
        <h1 className="mt-2 text-[clamp(2.2rem,1.6rem+2.4vw,3.4rem)] font-bold">
          ID Training
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--ink-soft)]">
          A structured Infectious Diseases curriculum for Internal Medicine and
          Family Medicine residents. Each module pairs learning objectives and
          key concepts with guidelines, pearls, relevant IDHub cases, and
          self-assessment questions.
        </p>
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-1 text-sm text-[var(--muted)]">
          <span>
            <span className="font-semibold text-[var(--foreground)]">
              {CURRICULUM_MODULES.length}
            </span>{" "}
            modules
          </span>
          <span>
            <span className="font-semibold text-[var(--foreground)]">
              {CURRICULUM_CATEGORIES.length}
            </span>{" "}
            categories
          </span>
        </div>
      </header>

      <section className="grid gap-8 py-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:items-start">
        <aside className="lg:sticky lg:top-28">
          <div className="border border-[var(--border)] bg-[var(--background-soft)] p-5">
            <p className="idhub-kicker">How to use</p>
            <p className="mt-2 text-sm leading-7 text-[var(--ink-soft)]">
              Work through a module in order: objectives → key concepts → evidence
              → pearls → cases → questions. Each module is self-contained, so you
              can also jump to whatever you are seeing on the wards.
            </p>
            <p className="mt-4 text-xs text-[var(--muted)]">
              Content is for education only and does not replace institutional
              guidelines, local antibiograms, or specialist consultation.
            </p>
          </div>
        </aside>

        <div>
          {CURRICULUM_CATEGORIES.map((category) => {
            const modules = CURRICULUM_MODULES.filter(
              (m) => m.category === category,
            );
            if (modules.length === 0) return null;
            return (
              <div key={category} className="mb-8 last:mb-0">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--muted-soft)]">
                  {category}
                </h2>
                <div className="grid gap-x-6 gap-y-5">
                  {modules.map((m) => (
                    <Link
                      key={m.slug}
                      href={`/training/${m.slug}`}
                      className="group block border-b border-[var(--border)] pb-5 last:border-b-0"
                    >
                      <div className="flex items-baseline gap-3">
                        <h3
                          className="text-[1.3rem] font-semibold leading-snug text-[var(--foreground)] group-hover:text-[var(--primary)]"
                          style={{ fontFamily: "var(--font-serif)" }}
                        >
                          {m.title}
                        </h3>
                      </div>
                      <p className="mt-1.5 text-sm leading-6 text-[var(--muted)]">
                        {m.summary}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--muted-soft)]">
                        {m.difficulty ? (
                          <span>{difficultyLabel[m.difficulty]}</span>
                        ) : null}
                        {m.readMins ? <span>~{m.readMins} min</span> : null}
                        <span className="text-[var(--primary)] group-hover:underline">
                          Open module →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
