import type { Metadata } from "next";

import { CASES } from "@/lib/cases/registry";

const BASE_URL = "https://infectiousdiseasehub.com";
const MAX_SEO_TITLE_LENGTH = 70;
const CASE_TITLE_SUFFIX = " | IDHub Case";

type CaseDateEntry = {
  publishedAt: string;
  modifiedAt: string;
};

const CASE_DATES: Record<string, CaseDateEntry> = {
  "actinomycosis": {
    publishedAt: "2026-02-20T19:58:40-08:00",
    modifiedAt: "2026-02-20T20:48:24-08:00",
  },
  "aerococcus": {
    publishedAt: "2026-02-09T20:46:12-08:00",
    modifiedAt: "2026-02-20T20:38:05-08:00",
  },
  "blastomycosis": {
    publishedAt: "2026-02-26T21:50:03-08:00",
    modifiedAt: "2026-02-26T21:50:03-08:00",
  },
  "brucella-endocarditis": {
    publishedAt: "2026-02-27T23:02:15-08:00",
    modifiedAt: "2026-02-27T23:08:11-08:00",
  },
  "carrions-disease": {
    publishedAt: "2026-02-21T01:01:59-08:00",
    modifiedAt: "2026-02-21T01:01:59-08:00",
  },
  "cgatti": {
    publishedAt: "2026-02-15T10:33:49-08:00",
    modifiedAt: "2026-02-20T20:48:24-08:00",
  },
  "erythrasma": {
    publishedAt: "2026-03-03T19:33:11-08:00",
    modifiedAt: "2026-03-03T19:33:11-08:00",
  },
  "hzo-hutchinson-sign": {
    publishedAt: "2026-02-21T23:26:30-08:00",
    modifiedAt: "2026-02-21T23:31:37-08:00",
  },
  "hiv-hemodialysis": {
    publishedAt: "2026-03-04T22:40:00-08:00",
    modifiedAt: "2026-03-04T22:40:00-08:00",
  },
  "listeria-rhombencephalitis": {
    publishedAt: "2026-03-04T23:28:00-08:00",
    modifiedAt: "2026-03-04T23:28:00-08:00",
  },
  "lbrf": {
    publishedAt: "2026-02-22T12:13:50-08:00",
    modifiedAt: "2026-02-22T17:43:00-08:00",
  },
  "lobomycosis": {
    publishedAt: "2026-02-09T20:46:12-08:00",
    modifiedAt: "2026-02-20T20:48:24-08:00",
  },
  "m-bovis": {
    publishedAt: "2026-02-23T22:41:56-08:00",
    modifiedAt: "2026-02-23T22:41:56-08:00",
  },
  "nocardia-brasiliensis": {
    publishedAt: "2026-02-25T21:46:30-08:00",
    modifiedAt: "2026-02-25T23:28:05-08:00",
  },
  "paragonimiasis": {
    publishedAt: "2026-02-15T16:46:20-08:00",
    modifiedAt: "2026-02-20T20:48:24-08:00",
  },
  "parvovirus": {
    publishedAt: "2026-02-13T18:20:16-08:00",
    modifiedAt: "2026-02-20T20:48:24-08:00",
  },
  "powassan": {
    publishedAt: "2026-02-13T18:20:16-08:00",
    modifiedAt: "2026-02-20T20:48:24-08:00",
  },
  "rhinoscleroma": {
    publishedAt: "2026-02-09T20:46:12-08:00",
    modifiedAt: "2026-02-20T20:48:24-08:00",
  },
  "sancc": {
    publishedAt: "2026-02-28T09:44:56-08:00",
    modifiedAt: "2026-02-28T09:44:56-08:00",
  },
  "shigellosis": {
    publishedAt: "2026-03-03T19:06:43-08:00",
    modifiedAt: "2026-03-03T19:06:43-08:00",
  },
  "spirochetosis": {
    publishedAt: "2026-02-09T20:46:12-08:00",
    modifiedAt: "2026-02-20T20:48:24-08:00",
  },
  "ssuis": {
    publishedAt: "2026-02-14T00:06:08-08:00",
    modifiedAt: "2026-02-20T20:48:24-08:00",
  },
  "strongyloides-hyperinfection": {
    publishedAt: "2026-02-24T23:49:44-08:00",
    modifiedAt: "2026-02-25T09:09:25-08:00",
  },
  "talaromyces": {
    publishedAt: "2026-02-11T16:58:35-08:00",
    modifiedAt: "2026-02-20T20:48:24-08:00",
  },
  "tetanus-trismus": {
    publishedAt: "2026-02-28T09:44:56-08:00",
    modifiedAt: "2026-02-28T09:44:56-08:00",
  },
  "tungiasis": {
    publishedAt: "2026-02-09T20:46:12-08:00",
    modifiedAt: "2026-02-20T20:48:24-08:00",
  },
  "urogenital-schistosomiasis": {
    publishedAt: "2026-03-02T22:24:46-08:00",
    modifiedAt: "2026-03-02T22:29:44-08:00",
  },
};

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
  const description = match?.description
    ? `${match.description} Interactive infectious diseases case from IDHub.`
    : `Interactive infectious diseases case study: ${title}.`;
  const dates = CASE_DATES[slug];

  return {
    slug,
    title,
    description,
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

  return {
    title: seoTitle,
    description: entry.description,
    alternates: {
      canonical: entry.url,
    },
    openGraph: {
      type: "article",
      url: entry.url,
      siteName: "InfectiousDiseaseHub",
      title: seoTitle,
      description: entry.description,
      publishedTime: entry.publishedAt,
      modifiedTime: entry.modifiedAt,
      authors: ["Alvaro Ayala"],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: entry.description,
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
