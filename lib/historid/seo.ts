import type { Metadata } from "next";

import type { HistorIDMeta } from "@/lib/historid/registry";
import { HISTORID_CATEGORY_LABELS } from "@/lib/historid/registry";

const BASE_URL = "https://infectiousdiseasehub.com";

function toAbsoluteImageUrl(src: string) {
  return src.startsWith("http") ? src : `${BASE_URL}${src}`;
}

export function buildHistoridMetadata(fact: HistorIDMeta): Metadata {
  const url = `${BASE_URL}/historid/${fact.slug}`;
  const ogImageUrl = `${BASE_URL}/api/og/historid/${fact.slug}`;
  const categoryLabels = fact.categories.map((category) => HISTORID_CATEGORY_LABELS[category]);

  return {
    title: { absolute: `${fact.title} | HistorID` },
    description: fact.description,
    keywords: [...fact.tags, ...categoryLabels, "infectious diseases history", "medical history"],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: "InfectiousDiseaseHub",
      title: `${fact.title} | HistorID`,
      description: fact.description,
      images: [ogImageUrl],
      publishedTime: fact.publishedAt,
      authors: ["Alvaro Ayala"],
      tags: [...fact.tags, ...categoryLabels],
    },
    twitter: {
      card: "summary_large_image",
      title: `${fact.title} | HistorID`,
      description: fact.description,
      images: [ogImageUrl],
    },
  };
}

export function buildHistoridStructuredData(fact: HistorIDMeta) {
  const url = `${BASE_URL}/historid/${fact.slug}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: fact.title,
        description: fact.description,
        url,
        datePublished: fact.publishedAt,
        image: [toAbsoluteImageUrl(fact.heroImage)],
        author: {
          "@type": "Person",
          name: "Alvaro Ayala",
          jobTitle: "Infectious Diseases Fellow",
          affiliation: {
            "@type": "Organization",
            name: "Stanford University",
          },
        },
        publisher: {
          "@type": "Organization",
          name: "InfectiousDiseaseHub",
          url: BASE_URL,
        },
        isPartOf: {
          "@type": "CreativeWorkSeries",
          name: "HistorID",
          url: `${BASE_URL}/historid`,
        },
        about: fact.categories.map((category) => HISTORID_CATEGORY_LABELS[category]),
        keywords: fact.tags.join(", "),
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
            name: "HistorID",
            item: `${BASE_URL}/historid`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: fact.title,
            item: url,
          },
        ],
      },
    ],
  };
}
