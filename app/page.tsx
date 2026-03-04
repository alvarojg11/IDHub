import Link from "next/link";

import SiteFooter from "@/components/SiteFooter";

const medicalWebPageSchema = {
  "@context": "https://schema.org",
  "@type": "MedicalWebPage",
  name: "InfectiousDiseaseHub",
  url: "https://infectiousdiseasehub.com",
  description:
    "Educational platform with clinical reasoning tools and cases for infectious diseases.",
  publisher: {
    "@type": "Organization",
    name: "InfectiousDiseaseHub",
    url: "https://infectiousdiseasehub.com",
  },
  author: {
    "@type": "Person",
    name: "Alvaro Ayala, MD",
    affiliation: {
      "@type": "Organization",
      name: "Stanford University",
    },
    jobTitle: "Infectious Diseases Fellow",
  },
};

const authorSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Alvaro Ayala",
  jobTitle: "Infectious Diseases Fellow",
  affiliation: {
    "@type": "Organization",
    name: "Stanford University",
  },
  sameAs: [
    "https://www.researchgate.net/profile/Alvaro-Ayala-3",
    "https://infectiousdiseasehub.com/about",
  ],
};

const tiles = [
  {
    href: "/blog",
    title: "Blog",
    desc: "Reflections on diagnostics, antimicrobial therapy, and clinical reasoning in infectious diseases, shaped by training, bedside conversations, and the recognition that even strong evidence leaves room for nuance.",
  },
  {
    href: "/cases",
    title: "Cases",
    desc: "Clinical cases for ongoing learning in infectious diseases, using problem solving to revisit syndromes, pathogens, and treatment decisions.",
  },
  {
    href: "/mechid",
    title: "MechID",
    desc: "Need help interpreting antimicrobial susceptibility results? Try MechID.",
  },
  {
    href: "/tools/immunoid",
    title: "ImmunoID",
    desc: "Explore immunosuppressive medications, mechanisms of action, and high-yield infection risks-with an educational immunosuppression level estimate.",
  },
  {
    href: "/probid",
    title: "ProbID",
    desc: "Explore infectious syndromes through structured diagnostic inputs-with an educational post-test probability estimate.",
  },
  {
    href: "/tools/doseid",
    title: "DoseID",
    desc: "A reference app for optimizing antimicrobial dosing",
  },
  {
    href: "/research",
    title: "Research",
    desc: "A space for medical education research ideas, collaborations, and projects in clinical infectious diseases.",
  },
  {
    href: "/recommended-projects",
    title: "Recommended Projects",
    desc: "A space to discover infectious diseases education projects, medical education resources, and practical ID teaching tools, and to see how others are building new ideas for learning.",
  },
  {
    href: "/about",
    title: "About",
    desc: "Why IDHub exists, how it is meant to be used, and the philosophy behind case-based learning and clinical reasoning in infectious diseases.",
  },
];

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalWebPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(authorSchema) }}
      />

      <main className="mx-auto max-w-5xl px-6 py-12">
        <header className="mb-14">
          <div className="inline-flex items-baseline gap-2">
            <h1 className="text-5xl tracking-tight">
              <span className="font-extrabold text-[var(--foreground)]">ID</span>
              <span className="font-semibold text-[var(--foreground)]/80">Hub</span>
            </h1>
          </div>

          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--foreground)]/85">
            IDHub is an educational platform with interactive clinical tools and case-based learning
            to encourage and enhance clinical decision-making for clinicians, students, and trainees,
            and to build a community interested in clinical Infectious Diseases and Medical
            Education.
          </p>
        </header>

        <section className="grid gap-6 sm:grid-cols-3 lg:grid-cols-3">
          {tiles.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="group h-full rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2"
            >
              <div className="flex h-full flex-col">
                <h2 className="text-xl font-semibold text-[var(--foreground)]">{t.title}</h2>

                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{t.desc}</p>

                <div className="mt-auto pt-5">
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-[var(--primary)]">
                    Open
                    <span className="transition-transform group-hover:translate-x-0.5">→</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </section>

        <SiteFooter />
      </main>
    </>
  );
}
