import type { ReactNode } from "react";

import BlogComments from "@/components/BlogComments";

type BlogPostShellProps = {
  title: string;
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

export default function BlogPostShell({ title, publishedAt, children }: BlogPostShellProps) {
  const publishedLabel = formatPublishedAt(publishedAt);

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <article className="mx-auto max-w-4xl">
        <header className="mb-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--primary)]">
            IDHub Blog
          </p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
            {title}
          </h1>
          {publishedLabel ? (
            <p className="mt-3 text-sm text-[var(--muted)]">Published {publishedLabel}</p>
          ) : null}
        </header>

        <section className="idhub-blog-content rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-7">
          {children}
        </section>

        <div className="mt-8">
          <BlogComments />
        </div>
      </article>
    </main>
  );
}
