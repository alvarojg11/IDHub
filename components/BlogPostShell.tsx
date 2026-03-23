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
      <article className="mx-auto max-w-4xl">
        <header className="idhub-reading-shell mb-8 rounded-[2rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(241,248,245,0.95))] p-6 shadow-[var(--shadow-medium)] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">
            IDHub Blog
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-[var(--foreground)] sm:text-5xl">
            {title}
          </h1>
          {publishedLabel ? (
            <p className="mt-3 text-sm text-[var(--muted)]">Published {publishedLabel}</p>
          ) : null}
        </header>

        <section className="idhub-blog-content rounded-[1.9rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(247,251,249,0.94))] p-5 shadow-[var(--shadow-soft)] sm:p-8">
          {children}
        </section>

        <div className="mt-8">
          <BlogComments />
        </div>
      </article>

      <SiteFooter />
    </section>
  );
}
