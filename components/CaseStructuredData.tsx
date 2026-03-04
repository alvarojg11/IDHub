"use client";

import { usePathname } from "next/navigation";

import {
  buildCaseStructuredData,
  buildCasesCollectionStructuredData,
} from "@/lib/cases/seo";

export default function CaseStructuredData() {
  const pathname = usePathname();
  if (!pathname?.startsWith("/cases")) return null;

  if (pathname === "/cases") {
    const data = buildCasesCollectionStructuredData();

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
    );
  }

  const parts = pathname.split("/").filter(Boolean);
  if (parts.length !== 2) return null;

  const data = buildCaseStructuredData(parts[1]);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
