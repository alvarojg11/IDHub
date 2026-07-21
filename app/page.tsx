import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import EditorialCard from "@/components/EditorialCard";
import CrossContentTabs, { type FeedItem } from "@/components/CrossContentTabs";
import SiteFooter from "@/components/SiteFooter";
import { CASES } from "@/lib/cases/registry";
import { getCaseDirectoryEntries } from "@/lib/cases/directory";
import { getBlogPosts } from "@/lib/blog/registry";
import { getHistoridEntries } from "@/lib/historid/registry";
import { RECOMMENDED_PROJECTS } from "@/lib/recommended-projects";
import { CURRICULUM_MODULES } from "@/lib/curriculum/modules";

const BASE_URL = "https://infectiousdiseasehub.com";

export const metadata: Metadata = {
  title: {
    absolute: "IDHub | Infectious Diseases Education, Cases & Clinical Tools",
  },
  description:
    "IDHub is a free medical education platform for Infectious Diseases, featuring interactive clinical cases, diagnostic reasoning tools, and teaching essays for clinicians, students, and trainees.",
  alternates: { canonical: BASE_URL },
  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "InfectiousDiseaseHub",
    title: "IDHub | Infectious Diseases Education, Cases & Clinical Tools",
    description:
      "Free interactive clinical cases, diagnostic reasoning tools, and ID teaching essays.",
  },
  twitter: {
    card: "summary_large_image",
    title: "IDHub | Infectious Diseases Education, Cases & Clinical Tools",
    description:
      "Free interactive clinical cases, diagnostic reasoning tools, and ID teaching essays.",
  },
};

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
    affiliation: { "@type": "Organization", name: "Stanford University" },
    jobTitle: "Infectious Diseases Fellow",
  },
};

function formatDate(iso?: string | null) {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const clinicalTools = [
  {
    href: "/probid",
    title: "ProbID",
    desc: "Structured probability support for syndromes where pretest thinking matters.",
    tag: "Diagnostic framing",
  },
  {
    href: "/mechid",
    title: "MechID",
    desc: "Mechanism-based susceptibility interpretation grounded in microbiology and stewardship.",
    tag: "Antimicrobial reasoning",
  },
  {
    href: "/tools/immunoid",
    title: "ImmunoID",
    desc: "An educational guide to immunosuppressive therapies, mechanisms, and infection risk.",
    tag: "Host factors",
  },
  {
    href: "/tools/doseid",
    title: "DoseID",
    desc: "Practical antimicrobial dosing support built for real clinical decisions.",
    tag: "Dosing reference",
  },
  {
    href: "/tools/spectrum",
    title: "Spectrum",
    desc: "Searchable antimicrobial spectrum of activity chart for common organisms and antibiotics.",
    tag: "Reference",
  },
  {
    href: "/assistant",
    title: "IDAssistant",
    desc: "An interactive assistant for Infectious Diseases clinical reasoning.",
    tag: "Assistant",
  },
];

export default async function Home() {
  const ogBySlug = new Map(CASES.map((c) => [c.slug, c.ogImage]));

  const caseEntries = getCaseDirectoryEntries()
    .filter((c) => CASES.find((x) => x.slug === c.slug)?.enable !== false)
    .sort(
      (a, b) =>
        new Date(b.publishedAt ?? 0).getTime() -
        new Date(a.publishedAt ?? 0).getTime(),
    );

  const featuredCase = caseEntries[0];
  const recentCases = caseEntries.slice(0, 6);

  const blogPosts = await getBlogPosts();
  const historidEntries = await getHistoridEntries();
  const featuredHistorid = [...historidEntries]
    .filter((h) => h.publishedAt)
    .sort(
      (a, b) =>
        Date.parse(b.publishedAt as string) -
        Date.parse(a.publishedAt as string),
    )[0];

  const caseFeed: FeedItem[] = recentCases.map((c) => ({
    href: `/cases/${c.slug}`,
    kicker: c.syndromes[0],
    title: c.title,
    dek: c.description,
    imageSrc: ogBySlug.get(c.slug),
    dateLabel: formatDate(c.publishedAt),
  }));

  const blogFeed: FeedItem[] = blogPosts.slice(0, 6).map((p) => ({
    href: `/blog/${p.slug}`,
    title: p.title,
    dek: p.description,
    dateLabel: formatDate(p.publishedAt),
  }));

  const historidFeed: FeedItem[] = historidEntries.slice(0, 6).map((h) => ({
    href: h.url,
    kicker: h.historicalDateLabel,
    title: h.title,
    dek: h.hook,
    imageSrc: h.heroImage,
    dateLabel: formatDate(h.publishedAt),
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalWebPageSchema) }}
      />

      {/* Featured Case */}
      {featuredCase ? (
        <section className="border-b border-[var(--border)] py-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="idhub-kicker">Featured Case</p>
            <Link
              href="/cases"
              className="text-sm font-semibold text-[var(--primary)] hover:underline"
            >
              All Cases →
            </Link>
          </div>
          <EditorialCard
            href={`/cases/${featuredCase.slug}`}
            kicker={featuredCase.syndromes[0]}
            title={featuredCase.title}
            dek={featuredCase.description}
            imageSrc={ogBySlug.get(featuredCase.slug)}
            dateLabel={formatDate(featuredCase.publishedAt)}
            variant="lead"
          />
        </section>
      ) : null}

      {/* Recent Cases list */}
      <section className="border-b border-[var(--border)] py-8">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="text-2xl font-semibold">Recent Cases</h2>
          <Link
            href="/cases"
            className="text-sm font-semibold text-[var(--primary)] hover:underline"
          >
            See all →
          </Link>
        </div>
        <div className="grid gap-x-8 sm:grid-cols-2">
          {caseFeed.slice(0, 4).map((item) => (
            <div
              key={item.href}
              className="border-b border-[var(--border)] last:border-b-0 sm:[&:nth-child(odd)]:border-r sm:[&:nth-child(odd)]:pr-8"
            >
              <EditorialCard {...item} variant="list" />
            </div>
          ))}
        </div>
      </section>

      {/* Tabbed cross-content feed */}
      <section className="border-b border-[var(--border)] py-8">
        <h2 className="mb-5 text-2xl font-semibold">Latest across IDHub</h2>
        <CrossContentTabs
          cases={caseFeed}
          blog={blogFeed}
          historid={historidFeed}
        />
      </section>

      {/* From the Blog */}
      {blogPosts.length > 0 ? (
        <section className="border-b border-[var(--border)] py-8">
          <div className="mb-5 flex items-end justify-between">
            <h2 className="text-2xl font-semibold">From the Blog</h2>
            <Link
              href="/blog"
              className="text-sm font-semibold text-[var(--primary)] hover:underline"
            >
              All essays →
            </Link>
          </div>
          <div className="grid gap-x-6 gap-y-8 md:grid-cols-3">
            {blogPosts.slice(0, 3).map((p) => (
              <EditorialCard
                key={p.slug}
                href={`/blog/${p.slug}`}
                kicker="Essay"
                title={p.title}
                dek={p.description}
                dateLabel={formatDate(p.publishedAt)}
                variant="grid"
              />
            ))}
          </div>
        </section>
      ) : null}

      {/* HistorID feature */}
      {featuredHistorid ? (
        <section className="border-b border-[var(--border)] py-8">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="idhub-kicker">HistorID</p>
              <h2 className="mt-1 text-2xl font-semibold">This week in ID history</h2>
            </div>
            <Link
              href="/historid"
              className="text-sm font-semibold text-[var(--primary)] hover:underline"
            >
              All entries →
            </Link>
          </div>
          <EditorialCard
            href={featuredHistorid.url}
            kicker={featuredHistorid.historicalDateLabel}
            title={featuredHistorid.title}
            dek={featuredHistorid.hook}
            imageSrc={featuredHistorid.heroImage}
            imageAlt={featuredHistorid.heroImageAlt}
            variant="lead"
          />
        </section>
      ) : null}

      {/* Recommended Projects */}
      {RECOMMENDED_PROJECTS.length > 0 ? (
        <section className="border-b border-[var(--border)] py-8">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="idhub-kicker">Recommended Projects</p>
              <h2 className="mt-1 text-2xl font-semibold">
                Projects worth following
              </h2>
            </div>
            <Link
              href="/recommended-projects"
              className="text-sm font-semibold text-[var(--primary)] hover:underline"
            >
              See all →
            </Link>
          </div>
          <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
            {RECOMMENDED_PROJECTS.map((project) => (
              <Link
                key={project.name}
                href={project.href}
                target="_blank"
                rel="noreferrer"
                className="group flex items-start gap-4 border border-[var(--border)] bg-white p-5 hover:border-[var(--primary)]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden border border-[var(--border)] bg-[var(--background-soft)] p-1.5">
                  <Image
                    src={project.logoSrc}
                    alt={project.logoAlt}
                    width={48}
                    height={48}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <h3
                    className="text-lg font-semibold leading-snug text-[var(--foreground)] group-hover:text-[var(--primary)]"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {project.name}
                  </h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.1em] text-[var(--muted)]">
                    {project.tagline}
                  </p>
                  <span className="mt-2 inline-flex text-sm font-semibold text-[var(--primary)]">
                    Visit →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {/* Clinical Tools band */}
      <section className="border-b border-[var(--border)] bg-[var(--background-soft)] py-8">
        <div className="mb-6">
          <p className="idhub-kicker">Clinical Tools</p>
          <h2 className="mt-1 text-2xl font-semibold">
            Reasoning tools for the bedside
          </h2>
        </div>
        <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {clinicalTools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group block border border-[var(--border)] bg-white p-5 hover:border-[var(--primary)]"
            >
              <p className="idhub-kicker text-[0.6rem]">{tool.tag}</p>
              <h3 className="mt-2 text-xl font-semibold group-hover:text-[var(--primary)]">
                {tool.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                {tool.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ID Training CTA */}
      <section className="border-b border-[var(--border)] py-8">
        <div className="grid gap-6 border border-[var(--border)] bg-[var(--background-soft)] p-6 sm:grid-cols-[1.4fr_1fr] sm:items-center sm:p-8">
          <div>
            <p className="idhub-kicker">For residents &amp; trainees</p>
            <h2
              className="mt-1 text-2xl font-semibold"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              ID Training — a structured curriculum
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-7 text-[var(--muted)]">
              Objectives, key concepts, guidelines, pearls, cases, and
              self-assessment questions across {CURRICULUM_MODULES.length} core
              topics. Work through a module in order or jump to whatever you are
              seeing on the wards.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            <Link
              href="/training"
              className="idhub-button-primary px-5 py-3 text-sm font-semibold"
            >
              Browse modules →
            </Link>
            <p className="text-xs text-[var(--muted)]">
              Free · No login required
            </p>
          </div>
        </div>
      </section>

      {/* Subscribe CTA */}
      <section className="py-10">
        <div className="border border-[var(--border)] bg-white px-6 py-8 text-center sm:px-10">
          <p className="idhub-kicker">Stay Connected</p>
          <h2 className="mx-auto mt-2 max-w-2xl text-[clamp(1.5rem,1.1rem+1.4vw,2.2rem)] font-semibold">
            Keep up with new cases, essays, and tools
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[var(--muted)]">
            IDHub is an educational platform for Infectious Diseases clinical
            reasoning, diagnostic probability, and practical teaching resources.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/subscribe"
              className="idhub-button-primary px-5 py-3 text-sm font-semibold"
            >
              Subscribe
            </Link>
            <Link
              href="/about"
              className="idhub-button-secondary px-5 py-3 text-sm font-semibold"
            >
              About IDHub
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
