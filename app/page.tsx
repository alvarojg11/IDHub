import Link from "next/link";

import SiteFooter from "@/components/SiteFooter";

const medicalWebPageSchema = {
  "@context": "https://schema.org",
  "@type": "MedicalWebPage",
  name: "InfectiousDiseaseHub",
  url: "https://infectiousdiseasehub.com",
  description:
    "Educational platform with clinical reasoning tools and cases for Infectious Diseases.",
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

const stats = [
  { value: "5+", label: "interactive tools" },
  { value: "30+", label: "case-based learning modules" },
  { value: "1", label: "home for ID reasoning" },
];

const featuredTools = [
  {
    href: "/assistant",
    title: "Assistant",
    desc: "A full-screen reasoning workspace for walking through uncertainty in Infectious Diseases cases.",
    tag: "New workflow",
  },
  {
    href: "/probid",
    title: "ProbID",
    desc: "Structured probability support for syndromes where pretest thinking matters.",
    tag: "Diagnostic framing",
  },
  {
    href: "/tools/immunoid",
    title: "ImmunoID",
    desc: "An educational guide to immunosuppressive therapies, mechanisms, and infection risk.",
    tag: "Host factors",
  },
];

const librarySections = [
  {
    href: "/cases",
    title: "Cases",
    desc: "Case-driven learning for syndromes, pathogens, and management choices.",
  },
  {
    href: "/blog",
    title: "Blog",
    desc: "Short essays and teaching pieces on diagnostics, antimicrobial therapy, and uncertainty.",
  },
  {
    href: "/mechid",
    title: "MechID",
    desc: "Resistance mechanism interpretation grounded in microbiology and clinical use.",
  },
  {
    href: "/tools/doseid",
    title: "DoseID",
    desc: "Practical antimicrobial dosing support built for real clinical decisions.",
  },
  {
    href: "/research",
    title: "Research",
    desc: "A place to explore collaborations and medical education projects.",
  },
  {
    href: "/recommended-projects",
    title: "Recommended Projects",
    desc: "A curated way to discover other thoughtful ID education projects and teaching tools.",
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

      <section className="pb-10 pt-6">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:items-stretch">
          <div className="relative overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(236,245,241,0.92))] px-6 py-8 shadow-[var(--shadow-medium)] sm:px-8 sm:py-10">
            <div className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top,rgba(20,92,71,0.14),transparent_70%)]" />
            <div className="relative">
              <p className="idhub-kicker">Infectious Diseases Education</p>
              <h1 className="mt-3 max-w-3xl text-5xl font-semibold text-[var(--foreground)] sm:text-6xl">
                An educational platform for Infectious Diseases
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
                IDHub brings together cases, teaching essays, and decision-support tools so learners
                and clinicians can approach uncertainty with more structure, nuance, and clarity.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/assistant"
                  className="rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(20,92,71,0.24)] hover:bg-[var(--primary-strong)]"
                >
                  Launch Assistant
                </Link>
                <Link
                  href="/cases"
                  className="rounded-full border border-[var(--border-strong)] bg-white/85 px-5 py-3 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                >
                  Explore Cases
                </Link>
                <Link
                  href="/about"
                  className="rounded-full border border-transparent px-5 py-3 text-sm font-semibold text-[var(--muted)] hover:border-[var(--border)] hover:bg-white/60 hover:text-[var(--foreground)]"
                >
                  About IDHub
                </Link>
              </div>

              <div className="mt-10 grid gap-4 border-t border-[var(--border)] pt-6 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-sm text-[var(--muted)]">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="lg:h-full">
            <div className="idhub-panel-strong flex h-full flex-col rounded-[1.75rem] p-6">
              <p className="idhub-kicker">Assistant Mission</p>
              <h2 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
                Infectious Diseases thinking, for everyone
              </h2>
              <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
                The assistant is designed to make Infectious Diseases clinical reasoning more
                accessible to clinicians, learners, and care teams. Its purpose is not to replace
                specialists, but to extend the habits of Infectious Diseases assessment: careful
                syndrome framing, differential construction, interpretation of host factors, and
                thoughtful antimicrobial decision-making.
              </p>

              <div className="mt-6 rounded-[1.4rem] border border-[var(--border)] bg-[var(--background-soft)] p-4">
                <p className="text-sm font-semibold text-[var(--foreground)]">The vision</p>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                  A practical educational assistant that helps bring the methods of Infectious
                  Diseases consultation to more clinicians, more patients, and more care settings.
                </p>
              </div>

              <Link
                href="/assistant"
                className="mt-auto inline-flex rounded-full border border-[var(--border-strong)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
              >
                Open the assistant
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="idhub-kicker">Core Tools</p>
            <h2 className="mt-2 text-4xl font-semibold text-[var(--foreground)]">
              Core educational tools
            </h2>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {featuredTools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group relative overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-soft)] hover:-translate-y-1 hover:border-[var(--border-strong)]"
            >
              <div className="absolute inset-x-6 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(20,92,71,0.14),transparent_70%)] opacity-0 transition group-hover:opacity-100" />
              <div className="relative">
                <span className="inline-flex rounded-full bg-[var(--primary-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--primary)]">
                  {tool.tag}
                </span>
                <h3 className="mt-5 text-3xl font-semibold text-[var(--foreground)]">
                  {tool.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{tool.desc}</p>
                <span className="mt-8 inline-flex text-sm font-semibold text-[var(--primary)]">
                  Open section
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-8">
        <div className="mb-6">
            <p className="idhub-kicker">Library</p>
            <h2 className="mt-2 text-4xl font-semibold text-[var(--foreground)]">
              Writing, tools, and collaborations for Infectious Diseases education
            </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {librarySections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-soft)] hover:border-[var(--border-strong)] hover:bg-white"
            >
              <h3 className="text-2xl font-semibold text-[var(--foreground)]">{section.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{section.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
