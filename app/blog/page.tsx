import Link from "next/link";

import SubscribeForm from "@/components/SubscribeForm";
import { getBlogPosts } from "@/lib/blog/registry";

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-[var(--foreground)]">Blog</h1>

        <p className="mt-4 max-w-3xl text-[var(--foreground)]/85 text-justify">
          Practical reflections on diagnostics, antimicrobials, and clinical uncertainty in
          infectious diseases. Posts are now published directly in IDHub, with no third-party
          platform.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/subscribe"
            className="inline-flex items-center justify-center rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white"
          >
            Subscribe
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-lg border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--foreground)]"
          >
            Collaborate
          </Link>
        </div>
      </header>

      <section className="grid gap-6 sm:grid-cols-2">
        {posts.map((post) => {
          const dateLabel = post.publishedAt
            ? new Date(post.publishedAt).toLocaleDateString()
            : "Draft / Undated";

          return (
            <article
              key={post.slug}
              className="group rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm transition hover:bg-[var(--cardHover)]"
            >
              <Link href={`/blog/${post.slug}`} className="block">
                <h2 className="text-xl font-semibold tracking-tight text-[var(--foreground)] transition group-hover:text-[var(--primary)]">
                  {post.title}
                </h2>

                <p className="mt-3 text-sm leading-relaxed text-[var(--foreground)]/80">
                  {post.description}
                </p>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <p className="text-xs text-[var(--muted)]">{dateLabel}</p>

                  <span className="text-xs font-semibold text-[var(--primary)]">Read →</span>
                </div>
              </Link>
            </article>
          );
        })}
      </section>

      {posts.length === 0 ? (
        <p className="mt-6 text-sm text-[var(--muted)]">
          No blog posts found yet. Add a post under `app/blog/&lt;slug&gt;/page.mdx`.
        </p>
      ) : null}

      <footer className="mt-12 border-t border-[var(--border)] pt-6">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
          <p className="text-sm font-semibold text-[var(--foreground)]">
            Subscribe to IDHub updates
          </p>
          <p className="mt-1 text-xs text-[var(--muted)]">Includes new cases and blog posts.</p>
          <div className="mt-3">
            <SubscribeForm compact />
          </div>
        </div>
      </footer>
    </main>
  );
}
