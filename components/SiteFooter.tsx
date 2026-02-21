import Link from "next/link";

import SubscribeForm from "@/components/SubscribeForm";

export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-[var(--border)] pt-8 text-sm text-[var(--muted)] py-12">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
          <p className="text-sm font-semibold text-[var(--foreground)]">Get IDHub updates</p>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Subscribe to receive an email when a new case or blog post is published.
          </p>
          <div className="mt-3">
            <SubscribeForm compact />
          </div>
        </div>

        <p>
          IDHub is an educational project focused on clinical teaching in Infectious Disease.
        </p>
        <p>
          Content is for learning purposes only and does not replace clinical judgment,
          institutional guidelines, or consultation with infectious diseases specialists.
        </p>
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <Link href="/subscribe" className="font-semibold text-[var(--primary)] hover:underline">
            Manage subscription
          </Link>
          <Link href="/contact" className="font-semibold text-[var(--primary)] hover:underline">
            Contact / Collaborate
          </Link>
        </p>
        <p className="text-xs text-[var(--muted)]">
          © {new Date().getFullYear()} IDHub
        </p>
      </div>
    </footer>
  );
}
