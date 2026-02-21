import "./globals.css";
import Link from "next/link";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IDHub",
  description:
    "Clinical cases, antimicrobial reasoning, and interactive tools for infectious diseases.",
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
      <body>
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

        {/* Header Bar */}
        <header className="border-b border-[var(--border)] bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link
              href="/"
              className="text-xl font-bold tracking-tight text-[var(--primary)]"
            >
              IDHub
            </Link>

            <nav className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1 text-sm text-[var(--muted)]">
              <Link href="/blog" className="hover:text-[var(--primary)]">
                Blog
              </Link>
              <Link href="/cases" className="hover:text-[var(--primary)]">
                Cases
              </Link>
              <Link href="/mechid" className="hover:text-[var(--primary)]">
                MechID
              </Link>
              <Link href="/tools/immunoid" className="hover:text-[var(--primary)]">
                ImmunoID
              </Link>
              <Link href="/probid" className="hover:text-[var(--primary)]">
                ProbID
              </Link>
              <Link href="/tools/doseid" className="hover:text-[var(--primary)]">
                DoseID
              </Link>
              <Link href="/subscribe" className="hover:text-[var(--primary)]">
                Subscribe
              </Link>
              <Link href="/contact" className="hover:text-[var(--primary)]">
                Contact
              </Link>
              <Link href="/about" className="hover:text-[var(--primary)]">
                About
              </Link>
            </nav>
          </div>
        </header>

        {/* Page Content */}
        <main className="mx-auto max-w-6xl px-6 py-2">
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  );
}
