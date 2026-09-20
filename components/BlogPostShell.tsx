import type { ReactNode } from "react";

import BlogComments from "@/components/BlogComments";
import SiteFooter from "@/components/SiteFooter";
import { buildBlogStructuredData } from "@/lib/blog/seo";

type BlogPostShellProps = {
  title: string;
  description?: string;
  slug?: string;
  publishedAt?: string | null;
  children: ReactNode;
};

function formatPublishedAt(input?: string | null) {
  if (!input) return null;
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPostShell({ title, description, slug, publishedAt, children }: BlogPostShellProps) {
  const publishedLabel = formatPublishedAt(publishedAt);
  const structuredData = slug
    ? buildBlogStructuredData({
        slug,
        title,
        description: description ?? "",
        publishedAt: publishedAt ?? undefined,
      })
    : null;

  return (
    <section className="mx-auto max-w-6xl px-2 py-10 sm:px-4">
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      <article className="mx-auto max-w-3xl">
        <header className="border-b border-[var(--border-strong)] pb-7">
          <p className="idhub-kicker">IDHub Blog</p>
          <h1 className="mt-3 text-[clamp(2.15rem,1.55rem+2.4vw,3.7rem)] font-semibold leading-[1.05] text-[var(--foreground)]">
            {title}
          </h1>
          {description ? (
            <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--ink-soft)]">
              {description}
            </p>
          ) : null}
          {publishedLabel ? (
            <p className="mt-5 text-xs uppercase tracking-[0.14em] text-[var(--muted-soft)]">
              Published {publishedLabel} · Essay
            </p>
          ) : null}
        </header>

        <section className="idhub-blog-content mt-8">
          {children}
        </section>

        <div className="mt-10 border-t border-[var(--border)] pt-8">
          <BlogComments />
        </div>
      </article>

      <SiteFooter />
    </section>
  );
}
