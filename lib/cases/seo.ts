import type { Metadata } from "next";

import { CASE_DATES } from "@/lib/cases/dates";
import { CASES } from "@/lib/cases/registry";

const BASE_URL = "https://infectiousdiseasehub.com";
const MAX_SEO_TITLE_LENGTH = 70;
const CASE_TITLE_SUFFIX = " | IDHub Case";

const AUTHOR = {
  "@type": "Person",
  name: "Alvaro Ayala",
  jobTitle: "Infectious Diseases Fellow",
  affiliation: {
    "@type": "Organization",
    name: "Stanford University",
  },
};

function fallbackTitleFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
}

export function getCaseSeoEntry(slug: string) {
  const match = CASES.find((item) => item.slug === slug);
  const title = match?.title ?? fallbackTitleFromSlug(slug);

  const organismHint = match?.tags?.organisms?.length
    ? ` Featuring ${match.tags.organisms.join(", ")}.`
    : "";
  const description = match?.description
    ? `${match.description}${organismHint} Interactive infectious diseases case from IDHub.`
    : `Interactive infectious diseases case study: ${title}.`;
  const dates = CASE_DATES[slug];

  return {
    slug,
    title,
    description,
    tags: match?.tags,
    ogImage: match?.ogImage ?? null,
    url: `${BASE_URL}/cases/${slug}`,
    publishedAt: dates?.publishedAt ?? undefined,
    modifiedAt: dates?.modifiedAt ?? dates?.publishedAt ?? undefined,
  };
}

function toCaseSeoTitle(rawTitle: string) {
  const normalized = rawTitle.replace(/\s+/g, " ").trim();
  const full = `${normalized}${CASE_TITLE_SUFFIX}`;
  if (full.length <= MAX_SEO_TITLE_LENGTH) return full;

  const maxBaseLen = Math.max(24, MAX_SEO_TITLE_LENGTH - CASE_TITLE_SUFFIX.length - 3);
  const clipped = normalized.slice(0, maxBaseLen).replace(/[\s:;,\-]+$/g, "");
  return `${clipped}...${CASE_TITLE_SUFFIX}`;
}

export function buildCaseMetadata(slug: string): Metadata {
  const entry = getCaseSeoEntry(slug);
  const seoTitle = toCaseSeoTitle(entry.title);

  const keywords = [
    ...(entry.tags?.organisms ?? []),
    ...(entry.tags?.syndromes ?? []),
    ...(entry.tags?.concepts ?? []),
    "infectious diseases", "clinical case", "medical education",
  ];

  return {
    title: { absolute: seoTitle },
    description: entry.description,
    keywords,
    alternates: {
      canonical: entry.url,
    },
    openGraph: {
      type: "article",
      url: entry.url,
      siteName: "InfectiousDiseaseHub",
      title: seoTitle,
      description: entry.description,
      images: [entry.ogImage ? `${BASE_URL}${entry.ogImage}` : `${BASE_URL}/api/og/cases/${slug}`],
      publishedTime: entry.publishedAt,
      modifiedTime: entry.modifiedAt,
      authors: ["Alvaro Ayala"],
      tags: [...(entry.tags?.organisms ?? []), ...(entry.tags?.syndromes ?? [])],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: entry.description,
      images: [`${BASE_URL}/api/og/cases/${slug}`],
    },
  };
}

export function buildCaseStructuredData(slug: string) {
  const entry = getCaseSeoEntry(slug);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalCaseStudy",
        name: entry.title,
        url: entry.url,
        description: entry.description,
        datePublished: entry.publishedAt,
        dateModified: entry.modifiedAt,
        author: AUTHOR,
        publisher: {
          "@type": "Organization",
          name: "InfectiousDiseaseHub",
          url: BASE_URL,
        },
        isPartOf: {
          "@type": "CollectionPage",
          name: "InfectiousDiseaseHub Clinical Cases",
          url: `${BASE_URL}/cases`,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: BASE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Cases",
            item: `${BASE_URL}/cases`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: entry.title,
            item: entry.url,
          },
        ],
      },
    ],
  };
}

export function buildCasesCollectionStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "InfectiousDiseaseHub Clinical Cases",
        url: `${BASE_URL}/cases`,
        description: "Interactive, stepwise infectious diseases clinical reasoning cases.",
        hasPart: CASES.map((item) => ({
          "@type": "MedicalCaseStudy",
          name: item.title,
          url: `${BASE_URL}/cases/${item.slug}`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: BASE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Cases",
            item: `${BASE_URL}/cases`,
          },
        ],
      },
    ],
  };
}
