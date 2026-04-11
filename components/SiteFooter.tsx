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
          <div className="mt-3 flex items-center gap-4">
            <p className="text-xs text-[var(--muted-soft)]">© {new Date().getFullYear()} IDHub</p>
            <div className="flex items-center gap-3">
              {/* Bluesky */}
              <a
                href="https://bsky.app/profile/id-hub.bsky.social"
                target="_blank"
                rel="noreferrer"
                aria-label="IDHub on Bluesky"
                className="text-[var(--muted)] transition hover:text-[var(--primary)]"
              >
                <svg width="18" height="18" viewBox="0 0 600 530" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M135.72 44.03C202.216 93.951 273.74 195.17 300 249.49c26.262-54.316 97.782-155.538 164.28-205.46C512.26 8.009 590-19.862 590 68.825c0 17.712-10.155 148.79-16.111 170.07-20.703 73.984-96.144 92.854-163.25 81.433 117.3 19.964 147.14 86.092 82.697 152.22-122.39 125.59-175.91-31.511-189.63-71.766-2.514-7.38-3.69-10.832-3.708-7.896-.017-2.936-1.193.516-3.707 7.896-13.714 40.255-67.233 197.36-189.63 71.766-64.444-66.128-34.605-132.26 82.697-152.22-67.108 11.421-142.55-7.449-163.25-81.433C20.15 217.613 10 86.535 10 68.825c0-88.687 77.742-60.816 125.72-24.795z" />
                </svg>
              </a>
              {/* Instagram */}
              <a
                href="https://www.instagram.com/infectiousdiseasehub/"
                target="_blank"
                rel="noreferrer"
                aria-label="IDHub on Instagram"
                className="text-[var(--muted)] transition hover:text-[var(--primary)]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
