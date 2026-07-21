import "./globals.css";
import { Source_Serif_4 } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import SiteHeader from "@/components/SiteHeader";

import type { Metadata } from "next";
import { getAllCaseSyndromes } from "@/lib/cases/directory";

const sourceSerif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const primaryNav = [
  { href: "/cases", label: "Cases" },
  { href: "/training", label: "Training" },
  { href: "/blog", label: "Blog" },
  { href: "/historid", label: "HistorID" },
  { href: "/research", label: "Research" },
  { href: "/about", label: "About" },
];

const toolsNav = [
  { href: "/probid", label: "ProbID" },
  { href: "/mechid", label: "MechID" },
  { href: "/tools/immunoid", label: "ImmunoID" },
  { href: "/tools/doseid", label: "DoseID" },
  { href: "/tools/spectrum", label: "Spectrum" },
];

const browseSyndromes = getAllCaseSyndromes();

export const metadata: Metadata = {
  title: {
    default: "IDHub | Infectious Diseases Education, Cases & Clinical Tools",
    template: "%s | IDHub",
  },
  description:
    "Infectious Disease Hub is an educational resource in Infectious Diseases, with clinical reasoning tools, case-based learning, medical education resources, and practical teaching content for clinicians, students, and trainees.",
  icons: {
    icon: "/favicon.ico",
  },
  metadataBase: new URL("https://infectiousdiseasehub.com"),
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
};

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-ZMBJ2JZ5XQ";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={sourceSerif.variable}>
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
        <SiteHeader
          primaryNav={primaryNav}
          toolsNav={toolsNav}
          browseSyndromes={browseSyndromes}
        />

        <main className="relative mx-auto w-full max-w-[1200px] px-4 pb-12 pt-2 sm:px-6 lg:px-8">
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  );
}
