import "./globals.css";
import Link from "next/link";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";

import type { Metadata } from "next";

const primaryNav = [
  { href: "/blog", label: "Blog" },
  { href: "/cases", label: "Cases" },
  { href: "/mechid", label: "MechID" },
  { href: "/tools/immunoid", label: "ImmunoID" },
  { href: "/probid", label: "ProbID" },
  { href: "/tools/doseid", label: "DoseID" },
  { href: "/research", label: "Research" },
  { href: "/about", label: "About" },
];

export const metadata: Metadata = {
  title: "IDHub",
  description:
    "Infectious Disease Hub is an educational resource in infectious disease, with clinical reasoning tools, case-based learning, medical education resources, and practical teaching content for clinicians, students, and trainees.",
  icons: {
    icon: "/favicon.ico",
  },
};

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-ZMBJ2JZ5XQ";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="idhub-shell">
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}');
          `}
        </Script>
        <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-white/75 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <Link href="/" className="group flex min-w-0 flex-col">
              <span className="idhub-kicker">Clinical Learning Platform</span>
              <span className="mt-1 text-3xl font-semibold text-[var(--foreground)] sm:text-[2.15rem]">
                IDHub
              </span>
              <span className="mt-1 max-w-md text-sm text-[var(--muted)]">
                Infectious diseases cases, uncertainty tools, and practical teaching content.
              </span>
            </Link>

            <div className="flex flex-col gap-3 lg:items-end">
              <nav className="flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">
                {primaryNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-full border border-transparent px-3 py-1.5 hover:border-[var(--border)] hover:bg-white/80 hover:text-[var(--foreground)]"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href="/contact"
                  className="rounded-full border border-[var(--border)] bg-white/80 px-4 py-2 text-sm font-semibold text-[var(--foreground)] shadow-[0_8px_24px_rgba(13,30,24,0.06)] hover:border-[var(--border-strong)] hover:bg-white"
                >
                  Contact
                </Link>
                <Link
                  href="/assistant"
                  className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(20,92,71,0.28)] hover:bg-[var(--primary-strong)]"
                >
                  Open Assistant
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="relative mx-auto max-w-7xl px-4 pb-10 pt-4 sm:px-6 lg:px-8">
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  );
}
