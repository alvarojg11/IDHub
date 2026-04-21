import type { Metadata } from "next";
import Link from "next/link";

import SiteFooter from "@/components/SiteFooter";
import { getBlogPosts } from "@/lib/blog/registry";

const BASE_URL = "https://infectiousdiseasehub.com";

export const metadata: Metadata = {
  title: "Blog — Infectious Diseases Teaching Essays",
  description:
    "Practical reflections on diagnostics, antimicrobials, and clinical reasoning in Infectious Diseases. Teaching essays from an ID fellow at Stanford.",
  alternates: { canonical: `${BASE_URL}/blog` },
  openGraph: {
    type: "website",
    url: `${BASE_URL}/blog`,
    siteName: "InfectiousDiseaseHub",
    title: "Blog — Infectious Diseases Teaching Essays | IDHub",
    description:
      "Practical reflections on diagnostics, antimicrobials, and clinical reasoning in Infectious Diseases.",
    images: [`${BASE_URL}/api/og/blog/index`],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — Infectious Diseases Teaching Essays | IDHub",
    description:
      "Practical reflections on diagnostics, antimicrobials, and clinical reasoning in Infectious Diseases.",
    images: [`${BASE_URL}/api/og/blog/index`],
  },
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <section className="mx-auto max-w-6xl px-2 py-10 sm:px-4">
      <header className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:items-start">
        <div className="idhub-panel-strong rounded-[2rem] px-6 py-8 sm:px-8">
          <p className="idhub-kicker">ID Writing</p>
          <h1 className="mt-3 text-5xl font-semibold text-[var(--foreground)] sm:text-6xl">
            Blog
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--muted)] sm:text-lg">
            Practical reflections on diagnostics, antimicrobials, and clinical uncertainty in
            Infectious Diseases. Posts now live directly inside IDHub so the writing feels like part
            of the same learning system as the tools and cases.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/subscribe"
              className="idhub-button-primary px-5 py-3 text-sm font-semibold"
            >
              Subscribe
            </Link>
            <Link
              href="/contact"
              className="idhub-button-secondary px-5 py-3 text-sm font-semibold"
            >
              Collaborate
            </Link>
          </div>
        </div>

        <aside className="idhub-panel rounded-[1.75rem] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted-soft)]">
            What to expect
          </p>
          <ul className="mt-4 space-y-4 text-sm leading-7 text-[var(--muted)]">
            <li>Short essays grounded in bedside questions and uncertainty.</li>
            <li>Teaching-oriented writing that pairs well with the interactive tools.</li>
            <li>{posts.length} published posts and growing.</li>
          </ul>
        </aside>
      </header>

      <section className="mt-10">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="idhub-kicker">Latest Essays</p>
            <h2 className="mt-2 text-3xl font-semibold text-[var(--foreground)]">
              Recent posts from IDHub
            </h2>
          </div>
        </div>

        <div className="idhub-panel rounded-[1.8rem] p-5 sm:p-6">
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => {
              const dateLabel = post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString()
                : "Draft / Undated";

              return (
                <article
                  key={post.slug}
                  className="group rounded-[1.6rem] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:border-[var(--border-strong)]"
                >
                  <Link href={`/blog/${post.slug}`} className="block h-full">
                    <div className="flex h-full flex-col">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-soft)]">
                        {dateLabel}
                      </p>
                      <h3 className="mt-4 text-3xl font-semibold text-[var(--foreground)] transition group-hover:text-[var(--primary)]">
                        {post.title}
                      </h3>
                      <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
                        {post.description}
                      </p>
                      <span className="mt-auto pt-8 text-sm font-semibold text-[var(--primary)]">
                        Read article
                      </span>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {posts.length === 0 ? (
        <p className="mt-6 text-sm text-[var(--muted)]">
          No blog posts found yet. Add a post under `app/blog/&lt;slug&gt;/page.mdx`.
        </p>
      ) : null}

      <SiteFooter />
    </section>
  );
}
