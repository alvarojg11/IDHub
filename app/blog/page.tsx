import type { Metadata } from "next";
import Link from "next/link";

import EditorialCard from "@/components/EditorialCard";
import SiteFooter from "@/components/SiteFooter";
import { getBlogPosts } from "@/lib/blog/registry";

const BASE_URL = "https://infectiousdiseasehub.com";

export const metadata: Metadata = {
  title: "Blog — Infectious Diseases Insights and Teaching Essays",
  description:
    "Curious about the art of Infectious Diseases? Explore diagnostics, syndromes, antimicrobials, and the clinical uncertainty that makes ID so compelling.",
  alternates: { canonical: `${BASE_URL}/blog` },
  openGraph: {
    type: "website",
    url: `${BASE_URL}/blog`,
    siteName: "InfectiousDiseaseHub",
    title: "Blog — Infectious Diseases Insights and Teaching Essays | IDHub",
    description:
      "Curious about the art of Infectious Diseases? Explore diagnostics, syndromes, antimicrobials, and the clinical uncertainty that makes ID so compelling.",
    images: [`${BASE_URL}/api/og/blog/index`],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — Infectious Diseases Insights and Teaching Essays | IDHub",
    description:
      "Curious about the art of Infectious Diseases? Explore diagnostics, syndromes, antimicrobials, and the clinical uncertainty that makes ID so compelling.",
    images: [`${BASE_URL}/api/og/blog/index`],
  },
};

function formatDate(iso: string | null) {
  if (!iso) return "Draft / Undated";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Draft / Undated";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="py-8">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--border)] pb-8">
        <div>
          <p className="idhub-kicker">ID Writing</p>
          <h1 className="mt-2 text-[clamp(2.2rem,1.6rem+2.4vw,3.4rem)] font-bold">
            Blog
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--ink-soft)]">
            Short essays grounded in bedside questions and clinical uncertainty.{" "}
            <span className="text-[var(--muted)]">
              {posts.length} published posts and growing.
            </span>
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/subscribe"
            className="idhub-button-primary px-4 py-2.5 text-sm font-semibold"
          >
            Subscribe
          </Link>
          <Link
            href="/contact"
            className="idhub-button-secondary px-4 py-2.5 text-sm font-semibold"
          >
            Collaborate
          </Link>
        </div>
      </header>

      <section className="pt-8">
        {posts.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">
            No blog posts found yet. Add a post under{" "}
            <code>app/blog/&lt;slug&gt;/page.mdx</code>.
          </p>
        ) : (
          <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <EditorialCard
                key={post.slug}
                href={`/blog/${post.slug}`}
                kicker="Essay"
                title={post.title}
                dek={post.description}
                dateLabel={formatDate(post.publishedAt)}
                variant="grid"
              />
            ))}
          </div>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}
