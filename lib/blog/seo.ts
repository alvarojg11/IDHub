import type { Metadata } from "next";

const BASE_URL = "https://infectiousdiseasehub.com";

type BlogMetaInput = {
  title: string;
  description: string;
  publishedAt?: string;
};

export function buildBlogMetadata(slug: string, post: BlogMetaInput): Metadata {
  const url = `${BASE_URL}/blog/${slug}`;
  const seoTitle = `${post.title} | IDHub Blog`;
  const ogImageUrl = `${BASE_URL}/api/og/blog/${slug}`;

  return {
    title: { absolute: seoTitle },
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: "InfectiousDiseaseHub",
      title: seoTitle,
      description: post.description,
      images: [ogImageUrl],
      publishedTime: post.publishedAt,
      authors: ["Alvaro Ayala"],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: post.description,
      images: [ogImageUrl],
    },
  };
}

export function buildBlogStructuredData(post: BlogMetaInput & { slug: string }) {
  const url = `${BASE_URL}/blog/${post.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    url,
    datePublished: post.publishedAt,
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
      "@type": "Blog",
      name: "IDHub Blog",
      url: `${BASE_URL}/blog`,
    },
  };
}
