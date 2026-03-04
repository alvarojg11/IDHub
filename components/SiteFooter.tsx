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

        <div className="space-y-1 text-[var(--foreground)]/90">
          <p className="text-sm font-semibold text-[var(--foreground)]">InfectiousDiseaseHub</p>
          <p className="text-sm text-[var(--muted)]">
            Educational platform for infectious diseases clinical reasoning, diagnostic probability
            tools, and antimicrobial decision support.
          </p>
          <p className="pt-1 text-sm text-[var(--foreground)]">
            Created by Alvaro Ayala, MD
          </p>
          <p className="text-sm text-[var(--foreground)]/85">
            Infectious Diseases Fellow - Stanford University
          </p>
        </div>
        <p>
          Content is for learning purposes only and does not replace clinical judgment,
          institutional guidelines, or consultation with infectious diseases specialists.
        </p>
        <p>
          IDHub is an educational project focused on clinical teaching in Infectious Disease.
        </p>
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <Link href="/subscribe" className="font-semibold text-[var(--primary)] hover:underline">
            Manage subscription
          </Link>
          <Link href="/contact" className="font-semibold text-[var(--primary)] hover:underline">
            Contact / Collaborate
          </Link>
          <Link href="/privacy" className="font-semibold text-[var(--primary)] hover:underline">
            Privacy
          </Link>
          <Link href="/terms" className="font-semibold text-[var(--primary)] hover:underline">
            Terms
          </Link>
        </p>
        <p className="text-xs text-[var(--muted)]">
          © {new Date().getFullYear()} IDHub
        </p>
      </div>
    </footer>
  );
}
