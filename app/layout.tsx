import "./globals.css";
import Link from "next/link";
import { Analytics } from '@vercel/analytics/next';

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IDHub",
  description:
    "Clinical cases, antimicrobial reasoning, and interactive tools for infectious diseases.",
  icons: {
    icon: "/favicon.ico",
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Header Bar */}
        <header className="border-b border-[var(--border)] bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link
              href="/"
              className="text-xl font-bold tracking-tight text-[var(--primary)]"
            >
              IDHub
            </Link>

            <nav className="flex items-center gap-6 text-sm text-[var(--muted)]">
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
