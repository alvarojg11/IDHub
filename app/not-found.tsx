import Link from "next/link";

import SiteFooter from "@/components/SiteFooter";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 text-center">
      <p className="idhub-kicker">Page Not Found</p>
      <h1 className="mt-4 text-5xl font-semibold text-[var(--foreground)] sm:text-6xl">
        404
      </h1>
      <p className="mt-5 text-base leading-8 text-[var(--muted)] sm:text-lg">
        The page you&rsquo;re looking for doesn&rsquo;t exist or may have been moved.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="idhub-button-primary inline-flex items-center px-5 py-3 text-sm font-semibold"
        >
          Go Home
        </Link>
        <Link
          href="/cases"
          className="rounded-full border border-[var(--border)] bg-white/80 px-5 py-3 text-sm font-semibold text-[var(--foreground)] shadow-[0_8px_24px_rgba(13,30,24,0.06)] hover:border-[var(--border-strong)] hover:bg-white"
        >
          Browse Cases
        </Link>
        <Link
          href="/blog"
          className="rounded-full border border-[var(--border)] bg-white/80 px-5 py-3 text-sm font-semibold text-[var(--foreground)] shadow-[0_8px_24px_rgba(13,30,24,0.06)] hover:border-[var(--border-strong)] hover:bg-white"
        >
          Read Blog
        </Link>
      </div>

      <SiteFooter />
    </section>
  );
}
