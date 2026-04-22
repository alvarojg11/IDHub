"use client";

import type { ReactNode } from "react";
import { useSelectedLayoutSegment } from "next/navigation";

import CaseStructuredData from "@/components/CaseStructuredData";
import CaseNavAuto from "@/components/CaseNavAuto";
import CaseSectionNav from "@/components/CaseSectionNav";
import SiteFooter from "@/components/SiteFooter";
import styles from "./case-content.module.css";

export default function CasesLayout({ children }: { children: ReactNode }) {
  const segment = useSelectedLayoutSegment();

  if (segment === null) {
    return <>{children}</>;
  }

  return (
    <>
      <CaseStructuredData />
      <main className="mx-auto max-w-6xl px-2 py-10 sm:px-4">
        <div className="mx-auto max-w-6xl lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-8 xl:gap-10">
          <div className="min-w-0">
            <CaseSectionNav variant="mobile" />
            <article data-case-article className="mx-auto max-w-4xl">
              <section className={`${styles.caseContent} px-1 sm:px-2`}>
                {children}
              </section>
            </article>
          </div>

          <CaseSectionNav variant="desktop" />
        </div>

        <div className="mx-auto max-w-4xl">
          <CaseNavAuto />
        </div>
        <SiteFooter />
      </main>
    </>
  );
}
