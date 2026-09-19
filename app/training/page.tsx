import type { Metadata } from "next";
import Image from "next/image";
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

const moduleVisuals: Record<
  string,
  { src?: string; alt: string; plate: string; tone: string }
> = {
  "community-acquired-pneumonia": {
    src: "/cases/legionella/xray.png",
    alt: "Chest radiograph from an IDHub pneumonia case",
    plate: "CAP",
    tone: "Lung parenchyma",
  },
  "antibiotic-mechanisms-resistance": {
    src: "/cases/klebsiella-aerogenes-ampc-cholangitis/gram-stain.jpg",
    alt: "Gram stain from an IDHub resistant gram-negative infection case",
    plate: "MOA",
    tone: "Mechanism",
  },
  "infective-endocarditis": {
    src: "/cases/staphylococcus-lugdunensis-endocarditis/echo.png",
    alt: "Echocardiography image from an IDHub endocarditis case",
    plate: "IE",
    tone: "Valve infection",
  },
  "antimicrobial-stewardship": {
    src: "/cases/faecium-bacteremia/agar-plate.png",
    alt: "Agar plate image from an IDHub bacteremia case",
    plate: "ASP",
    tone: "Stewardship",
  },
  "basic-microbiology": {
    src: "/cases/streptococcus-gallolyticus-endocarditis/blood-agar.png",
    alt: "Blood agar plate from an IDHub microbiology case",
    plate: "MICRO",
    tone: "Taxonomy",
  },
  hiv: {
    src: "/cases/hiv-ltbi/normal-xray.png",
    alt: "Chest radiograph from an IDHub HIV and latent tuberculosis case",
    plate: "HIV",
    tone: "Viral care",
  },
  "urinary-tract-infection": {
    src: "/cases/psa-dtr/psa.png",
    alt: "Laboratory image from an IDHub resistant Pseudomonas case",
    plate: "UTI",
    tone: "Gram-negative disease",
  },
  "skin-and-soft-tissue-infection": {
    src: "/cases/DFI/om.png",
    alt: "Foot osteomyelitis image from an IDHub diabetic foot infection case",
    plate: "SSTI",
    tone: "Skin and bone",
  },
  "tick-borne-diseases": {
    src: "/cases/ehrlichiosis/smear.jpg",
    alt: "Peripheral smear image from an IDHub ehrlichiosis case",
    plate: "TBD",
    tone: "Vector-borne",
  },
  "sti-syphilis-prep": {
    src: "/cases/secondary-syphilis/secondary-syphilis.png",
    alt: "Clinical image from an IDHub secondary syphilis case",
    plate: "STI",
    tone: "Sexual health",
  },
  "diagnostic-stewardship": {
    alt: "Abstract diagnostic stewardship plate",
    plate: "Dx",
    tone: "Testing wisely",
  },
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

      <section className="py-8">
        <div className="border-y border-[var(--border)] py-4">
          <p className="max-w-3xl text-sm leading-7 text-[var(--muted)]">
            Resident-level ID review organized as short clinical chapters: the
            question at the bedside, the microbiology behind it, the evidence to
            read, and the self-check questions that make the reasoning stick.
          </p>
        </div>

        <div className="mt-8">
          {CURRICULUM_CATEGORIES.map((category) => {
            const modules = CURRICULUM_MODULES.filter(
              (m) => m.category === category,
            );
            if (modules.length === 0) return null;
            return (
              <div key={category} className="mb-12 last:mb-0">
                <div className="mb-4 flex items-end justify-between gap-4 border-b border-[var(--border)] pb-2">
                  <h2 className="text-xl font-semibold text-[var(--foreground)]">
                    {category}
                  </h2>
                  <span className="hidden text-xs uppercase tracking-[0.14em] text-[var(--muted-soft)] sm:inline">
                    {modules.length} {modules.length === 1 ? "module" : "modules"}
                  </span>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {modules.map((m, index) => {
                    const visual = moduleVisuals[m.slug] ?? {
                      alt: `${m.title} editorial plate`,
                      plate: m.title
                        .split(/\s+/)
                        .slice(0, 2)
                        .map((word) => word[0])
                        .join("")
                        .toUpperCase(),
                      tone: m.category,
                    };
                    return (
                      <Link
                        key={m.slug}
                        href={`/training/${m.slug}`}
                        className="group grid overflow-hidden border border-[var(--border)] bg-white transition-colors hover:border-[var(--primary)] sm:grid-cols-[148px_minmax(0,1fr)]"
                      >
                        <div className="relative min-h-36 border-b border-[var(--border)] bg-[var(--background-soft)] sm:border-b-0 sm:border-r">
                          {visual.src ? (
                            <Image
                              src={visual.src}
                              alt={visual.alt}
                              fill
                              sizes="(min-width: 768px) 148px, 100vw"
                              className="object-cover grayscale transition duration-300 group-hover:grayscale-0"
                            />
                          ) : (
                            <div className="flex h-full min-h-36 items-center justify-center bg-[linear-gradient(135deg,#f6f5f1_0%,#f6f5f1_49%,#ebe5d9_50%,#ebe5d9_100%)]">
                              <span
                                className="text-5xl font-semibold text-[var(--primary)]"
                                style={{ fontFamily: "var(--font-serif)" }}
                              >
                                {visual.plate}
                              </span>
                            </div>
                          )}
                          <div className="absolute inset-x-0 bottom-0 bg-white/90 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-[var(--muted)] backdrop-blur-sm">
                            Plate {String(index + 1).padStart(2, "0")} · {visual.tone}
                          </div>
                        </div>
                        <div className="p-4 sm:p-5">
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[var(--muted-soft)]">
                            {m.difficulty ? (
                              <span>{difficultyLabel[m.difficulty]}</span>
                            ) : null}
                            {m.readMins ? <span>~{m.readMins} min</span> : null}
                          </div>
                          <h3
                            className="mt-2 text-[1.3rem] font-semibold leading-snug text-[var(--foreground)] group-hover:text-[var(--primary)]"
                            style={{ fontFamily: "var(--font-serif)" }}
                          >
                            {m.title}
                          </h3>
                          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                            {m.summary}
                          </p>
                          <span className="mt-4 inline-block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--primary)] group-hover:underline">
                            Open module →
                          </span>
                        </div>
                      </Link>
                    );
                  })}
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
