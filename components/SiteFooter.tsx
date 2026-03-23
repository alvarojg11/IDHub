import Link from "next/link";

import SubscribeForm from "@/components/SubscribeForm";

const footerLinks = [
  { href: "/assistant", label: "IDAssistant" },
  { href: "/cases", label: "Cases" },
  { href: "/blog", label: "Blog" },
  { href: "/references", label: "Organism Index" },
  { href: "/probid", label: "ProbID" },
  { href: "/mechid", label: "MechID" },
  { href: "/tools/immunoid", label: "ImmunoID" },
  { href: "/tools/doseid", label: "DoseID" },
  { href: "/tools/spectrum", label: "Spectrum" },
];

const utilityLinks = [
  { href: "/research", label: "Research" },
  { href: "/recommended-projects", label: "Recommended Projects" },
  { href: "/contact", label: "Contact / Collaborate" },
  { href: "/subscribe", label: "Manage Subscription" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export default function SiteFooter() {
  return (
    <footer className="mt-16 py-12 text-sm text-[var(--muted)]">
      <div className="overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(239,246,243,0.94))] shadow-[var(--shadow-medium)]">
        <div className="grid gap-8 px-6 py-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:px-8">
          <div className="space-y-6">
            <div>
              <p className="idhub-kicker">Stay Connected</p>
              <h2 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
                Keep up with new cases, essays, and tools
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
                IDHub is an educational platform for Infectious Diseases clinical reasoning,
                diagnostic probability, and practical teaching resources.
              </p>
            </div>

            <div className="rounded-[1.4rem] border border-[var(--border)] bg-white/85 p-5">
              <p className="text-sm font-semibold text-[var(--foreground)]">Get IDHub updates</p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Subscribe to hear when a new case, blog post, or learning tool is published.
              </p>
              <div className="mt-4">
                <SubscribeForm compact />
              </div>
            </div>

            <div className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--background-soft)] p-5">
              <p className="text-sm font-semibold text-[var(--foreground)]">Created by Alvaro Ayala, MD</p>
              <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                Infectious Diseases Fellow at Stanford University, building a clearer, more useful
                home for case-based learning and clinical reasoning in ID.
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-[1.4rem] border border-[var(--border)] bg-white/80 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted-soft)]">
                Explore
              </p>
              <div className="mt-4 flex flex-col gap-3">
                {footerLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="font-semibold text-[var(--foreground)] hover:text-[var(--primary)]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-[1.4rem] border border-[var(--border)] bg-white/80 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted-soft)]">
                Utility
              </p>
              <div className="mt-4 flex flex-col gap-3">
                {utilityLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="font-semibold text-[var(--foreground)] hover:text-[var(--primary)]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--border)] px-6 py-5 lg:px-8">
          <p className="max-w-4xl text-xs leading-6 text-[var(--muted)]">
            Content is for learning purposes only and does not replace clinical judgment,
            institutional guidelines, or consultation with Infectious Diseases specialists. IDHub is
            an educational project focused on clinical teaching in Infectious Diseases.
          </p>
          <p className="mt-3 text-xs text-[var(--muted-soft)]">© {new Date().getFullYear()} IDHub</p>
        </div>
      </div>
    </footer>
  );
}
